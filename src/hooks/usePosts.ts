/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  deletePost,
  loadPosts,
  loadPostVotes,
  Post,
  PostVote,
  selectPost,
} from "../store/postsSlice";
import { deleteObject, ref } from "firebase/storage";
import { storage, fireStore, auth } from "@/firebase/clientApp";
import {
  deleteDoc,
  doc,
  writeBatch,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { changeIsOpen } from "@/store/authModalSlice";
import { useRouter } from "next/router";
const usePosts = () => {
  const dispatch = useDispatch();
  const postsStateValue = useSelector((state: RootState) => state.posts);
  const currentCommunity = useSelector(
    (state: RootState) => state.communities.currentCommunity
  );
  const [user] = useAuthState(auth);
  const router = useRouter();

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    voteValue: number,
    communityId: string
  ) => {
    event.stopPropagation();
    //  check user auth
    if (!user?.uid) {
      dispatch(changeIsOpen(true));
      return;
    }
    try {
      const batch = writeBatch(fireStore);
      const updatedPost = { ...post };
      const updatedPosts = [...postsStateValue.posts];
      let updatedPostVotes = [...postsStateValue.postVotes];
      let voteChange = voteValue;

      // Check if voted before
      const { voteStatus } = post;
      const existingVote = postsStateValue.postVotes.find(
        (vote) => vote.postId === post.id
      );

      // New vote
      if (!existingVote) {
        // Create new postVote document
        const postVoteRef = doc(
          collection(fireStore, "users", `${user?.uid}/postVotes`)
        );
        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: voteValue,
        };

        batch.set(postVoteRef, newVote);

        // Add/subtract vote
        updatedPost.voteStatus = voteStatus + voteValue;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        // existing vote
        const postVoteRef = doc(
          fireStore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );

        // Remove vote (up => neutral OR down => neutral)
        if (existingVote.voteValue === voteValue) {
          // Add/subtract 1 to/from post.voteStatus
          updatedPost.voteStatus = voteStatus - voteValue;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );

          // Delete postVote document
          batch.delete(postVoteRef);
          voteChange *= -1;

          // Reverse vote (up => down OR down => up)
        } else {
          // Add/subtract 2 to/from post.voteStatus
          voteChange = 2 * voteValue;
          updatedPost.voteStatus = voteStatus + 2 * voteValue;

          const voteIndex = postsStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          updatedPostVotes[voteIndex] = {
            ...existingVote,
            voteValue: voteValue,
          };
          // update the existing postVote doc
          batch.update(postVoteRef, {
            voteValue: voteValue,
          });
        }
      }

      // update the state
      const postIndex = postsStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIndex] = updatedPost;
      dispatch(loadPosts(updatedPosts));
      dispatch(loadPostVotes(updatedPostVotes));

      if (postsStateValue.selectedPost) {
        dispatch(selectPost(updatedPost));
      }

      // update post document
      const postRef = doc(fireStore, "posts", post.id!);
      batch.update(postRef, {
        voteStatus: voteStatus + voteChange,
      });

      await batch.commit();
    } catch (error: any) {
      console.log("onVote error", error.message);
    }
  };

  const onSelectPost = (post: Post) => {
    dispatch(selectPost(post));
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // check if there's an image
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      // delete the post document
      const postDocRef = doc(fireStore, "posts", post.id!);
      await deleteDoc(postDocRef);
      // update state
      dispatch(deletePost(post.id!));
      return true;
    } catch (error: any) {
      console.log("onDeletePost error", console.log(error.message));
      return false;
    }
  };

  const setPostsStateValue = (posts: Post[]) => {
    dispatch(loadPosts(posts));
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(fireStore, "users", `${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );

    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch(loadPostVotes(postVotes as PostVote[]));
  };

  useEffect(() => {
    if (!user || !currentCommunity?.id) return;
    getCommunityPostVotes(currentCommunity?.id);
  }, [user, currentCommunity]);

  useEffect(() => {
    if (!user) {
      dispatch(loadPostVotes([]));
    }
  }, [user]);
  return {
    postsStateValue,
    setPostsStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};

export default usePosts;
