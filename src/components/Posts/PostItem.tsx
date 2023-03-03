import { Post } from "@/store/postsSlice";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { useRouter } from "next/router";
import { FaReddit } from "react-icons/fa";
import Link from "next/link";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    voteValue: number,
    communityId: string
  ) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  isHomePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
  isHomePage,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const singlePostPage = !onSelectPost;
  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setError("");
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);

      if (!success) {
        throw new Error("Failed to delete the post");
      }

      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (error: any) {
      console.log("PostItem handleDelete error", error.message);
      setError(error.message);
    }
    setLoadingDelete(false);
  };

  return (
    <Flex
      border="1px solid"
      borderColor={singlePostPage ? "white" : "gray.300"}
      borderRadius={singlePostPage ? "4px 4px 0 0" : "4px"}
      bg="white"
      cursor={singlePostPage ? "unset" : "pointer"}
      _hover={{ borderColor: singlePostPage ? "none" : "gray.500" }}
    >
      <Flex
        direction="column"
        align="center"
        width="40px"
        p={2}
        bg={singlePostPage ? "none" : "gray.100"}
        borderRadius={singlePostPage ? 0 : "3px 0 0 3px"}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "brand.100" : "gray.400"}
          fontSize={22}
          _hover={{ color: "brand.100" }}
          onClick={(e) => onVote(e, post, 1, post.communityId)}
          cursor="pointer"
        />
        <Text fontSize="9pt">{post.voteStatus}</Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
          fontSize={22}
          cursor="pointer"
          _hover={{ color: "#4379ff" }}
          onClick={(e) => onVote(e, post, -1, post.communityId)}
        />
      </Flex>
      <Flex
        direction="column"
        width="100%"
        onClick={() => onSelectPost && onSelectPost(post)}
      >
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            {/* home page check */}
            {isHomePage && (
              <>
                {post.communityImageURL ? (
                  <Image
                    src={post.communityImageURL}
                    alt="community avatar"
                    borderRadius="full"
                    boxSize="18px"
                    mr={2}
                  />
                ) : (
                  <Icon as={FaReddit} fontSize="18pt" mr={1} color="blue.500" />
                )}

                <Text
                  fontWeight={700}
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(`r/${post.communityId}`);
                  }}
                  _hover={{ textDecoration: "underline" }}
                >{`r/${post.communityId}`}</Text>

                <Icon as={BsDot} color="gray.500" fontSize={8} />
              </>
            )}
            <Text color="gray.500">
              {`Posted by u/${post.creatorDisplayName} ${moment(
                new Date(post.createdAt.seconds * 1000)
              ).fromNow()}`}
            </Text>
          </Stack>
          <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize="10pt">{post.body}</Text>
          {post.imageURL && (
            <Flex justify="center" align="center" p={2}>
              {loadingImage && (
                <Skeleton mt="4" height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                src={post.imageURL}
                alt="post image"
                maxHeight="460px"
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500">
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">{post.numberOfComments}</Text>
          </Flex>
          {/* <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex> */}
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              onClick={(event) =>
                loadingDelete ? () => {} : handleDelete(event)
              }
              cursor={loadingDelete ? "unset" : "pointer"}
            >
              {loadingDelete ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
