/* eslint-disable react-hooks/exhaustive-deps */
import { Community } from "@/store/communitiesSlice";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, fireStore } from "@/firebase/clientApp";
import usePosts from "../../hooks/usePosts";
import { Post } from "@/store/postsSlice";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack } from "@chakra-ui/react";
import PostLoader from "./PostLoader";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    postsStateValue,
    setPostsStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();
  const getPosts = async () => {
    try {
      setIsLoading(true);
      // get posts for this commumity
      const postQuery = query(
        collection(fireStore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postQuery);
      // store posts in state
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: {
          seconds: doc.data().createdAt.seconds,
          nanoseconds: doc.data().createdAt.nanoseconds,
        },
      }));
      setPostsStateValue(posts as Post[]);
    } catch (error: any) {
      console.log("getPosts error", error.message);
      setError(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
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
              userVoteValue={undefined}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
