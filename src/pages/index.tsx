/* eslint-disable react-hooks/exhaustive-deps */
import CreatePostLink from "@/components/Community/CreatePostLink";
import Recommendations from "@/components/Community/Recommendations";
import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Posts/PostItem";
import { auth, fireStore } from "@/firebase/clientApp";
import { loadPosts, loadPostVotes, Post } from "@/store/postsSlice";
import { Stack } from "@chakra-ui/react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import PostLoader from "../components/Posts/PostLoader";
import useCommunityData from "../hooks/useCommunityData";
import usePosts from "../hooks/usePosts";
import { PostVote } from "../store/postsSlice";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { onDeletePost, onSelectPost, onVote, postsStateValue } = usePosts();
  const { communityStateValue } = useCommunityData();

  const buildUserHomeFeed = async () => {
    setIsLoading(true);

    try {
      if (communityStateValue.mySnippets.length) {
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );

        const postQuery = query(
          collection(fireStore, "posts"),
          where("communityId", "in", myCommunityIds),
          limit(10)
        );

        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: {
            seconds: doc.data().createdAt.seconds,
            nanoseconds: doc.data().createdAt.nanoseconds,
          },
        }));
        dispatch(loadPosts(posts as Post[]));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error: any) {
      console.log("buildUserHomeFeed error", error.message);
    }

    setIsLoading(false);
  };

  const buildNoUserHomeFeed = async () => {
    setIsLoading(true);

    try {
      const postQuery = query(
        collection(fireStore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: {
          seconds: doc.data().createdAt.seconds,
          nanoseconds: doc.data().createdAt.nanoseconds,
        },
      }));
      dispatch(loadPosts(posts as Post[]));
    } catch (error: any) {
      console.log("buildNoUserHomeFeed error", error.message);
    }

    setIsLoading(false);
  };

  const getUserPostVotes = async () => {
    try {
      const postIds = postsStateValue.posts.map((post) => post.id);

      const postVotesQuery = query(
        collection(fireStore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch(loadPostVotes(postVotes as PostVote[]));
    } catch (error: any) {
      console.log("getUserPostVotes error", error.message);
    }
  };

  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    if (user && postsStateValue.posts.length) {
      getUserPostVotes();
    }
    return () => {
      dispatch(loadPostVotes([]));
    };
  }, [user, postsStateValue.posts]);

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {isLoading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postsStateValue.posts.map((item) => (
              <PostItem
                post={item}
                key={item.id}
                onDeletePost={onDeletePost}
                onSelectPost={onSelectPost}
                onVote={onVote}
                userIsCreator={user?.uid === item.creatorId}
                userVoteValue={
                  postsStateValue.postVotes.find(
                    (vote) => vote.postId === item.id
                  )?.voteValue
                }
                isHomePage
              />
            ))}
          </Stack>
        )}
      </>
      <>
        <Recommendations />
      </>
    </PageContent>
  );
};

export default Home;
