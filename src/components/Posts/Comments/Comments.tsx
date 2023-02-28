import React, { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { Post, updateCommentCount } from "../../../store/postsSlice";
import { Box, Flex } from "@chakra-ui/react";
import CommentInput from "./CommentInput";
import {
  doc,
  writeBatch,
  collection,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { fireStore } from "@/firebase/clientApp";
import { Timestamp } from "firebase/firestore";
import { useDispatch } from "react-redux";

type CommentsProps = {
  user: User;
  selectedPost: Post;
  communityId: string;
};

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  communityId: string;
  postId: string;
  postTitle: string;
  commentText: string;
  createdAt: Timestamp;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const dispatch = useDispatch();

  const onCreateComment = async () => {
    setCreateLoading(true);
    try {
      const batch = writeBatch(fireStore);
      // create a comment doc
      const commentDocRef = doc(collection(fireStore, "comments"));

      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        communityId,
        postId: selectedPost.id!,
        postTitle: selectedPost.title!,
        commentText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);

      // update number of comments in post doc
      const postDocRef = doc(fireStore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();
      // update state

      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      dispatch(updateCommentCount(1));
    } catch (error: any) {
      console.log("onCreateComment error", error.message);
    }
    setCreateLoading(false);
  };

  const onDeleteComment = async (comment: Comment) => {
    // delete a comment doc
    // update number of comments in post doc
    // update state
  };

  const getPostComments = async () => {};

  useEffect(() => {
    getPostComments;
  }, []);

  return (
    <Box bg="white" borderRadius="0 0 4px 4px" p={2}>
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          user={user}
          createLoading={createLoading}
          onCreateComment={onCreateComment}
        />
      </Flex>
    </Box>
  );
};
export default Comments;
