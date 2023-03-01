/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { Post, updateCommentCount } from "../../../store/postsSlice";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import CommentInput from "./CommentInput";
import {
  doc,
  writeBatch,
  collection,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { fireStore } from "@/firebase/clientApp";
import { Timestamp, query, where, orderBy, getDocs } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { Comment } from "./CommentItem";
import CommentItem from "./CommentItem";

type CommentsProps = {
  user: User;
  selectedPost: Post;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
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

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

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
    setLoadingDeleteId(comment.id);

    try {
      const batch = writeBatch(fireStore);
      // delete a comment doc
      const commentDocRef = doc(fireStore, "comments", comment.id);
      batch.delete(commentDocRef);

      // update number of comments in post doc
      const postDocRef = doc(fireStore, "posts", selectedPost.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      // update state
      dispatch(updateCommentCount(-1));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error: any) {
      console.log("onDeleteComment error", error.message);
    }
    setLoadingDeleteId("");
  };

  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(fireStore, "comments"),
        where("postId", "==", selectedPost.id),
        orderBy("createdAt", "desc")
      );

      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log("getPostComments error", error.message);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

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
        {!fetchLoading && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length !== 0 ? (
              <>
                {comments.map((comment: Comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={loadingDeleteId === comment.id}
                    userId={user.uid}
                  />
                ))}
              </>
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
