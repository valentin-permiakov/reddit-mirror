/* eslint-disable react-hooks/exhaustive-deps */
import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Posts/PostItem";
import { auth, fireStore } from "@/firebase/clientApp";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import usePosts from "../../../../hooks/usePosts";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { Post, selectPost } from "@/store/postsSlice";
import { RootState } from "../../../../store/store";
import About from "@/components/Community/About";
import useCommunityData from "@/hooks/useCommunityData";
import Comments from "@/components/Posts/Comments/Comments";
import { User } from "firebase/auth";

const PostPage: React.FC = () => {
  const { postsStateValue, setPostsStateValue, onVote, onDeletePost } =
    usePosts();
  const [user] = useAuthState(auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const { communityStateValue } = useCommunityData();

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(fireStore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      dispatch(
        selectPost({
          id: postDoc.id,
          ...postDoc.data(),
          createdAt: {
            seconds: postDoc.data()?.createdAt.seconds,
            nanoseconds: postDoc.data()?.createdAt.nanoseconds,
          },
        } as Post)
      );
    } catch (error: any) {
      console.log("fetchPost error", error.message);
    }
  };

  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postsStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postsStateValue.selectedPost]);

  return (
    <PageContent>
      <>
        {postsStateValue.selectedPost && (
          <PostItem
            post={postsStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postsStateValue.postVotes.find(
                (vote) => vote.postId === postsStateValue.selectedPost?.id
              )?.voteValue
            }
            userIsCreator={
              user?.uid === postsStateValue.selectedPost?.creatorId
            }
          />
        )}
        <Comments
          user={user as User}
          selectedPost={postsStateValue.selectedPost!}
          communityId={postsStateValue.selectedPost?.communityId!}
        />
      </>
      {communityStateValue.currentCommunity && (
        <About communityData={communityStateValue.currentCommunity} />
      )}
    </PageContent>
  );
};
export default PostPage;
