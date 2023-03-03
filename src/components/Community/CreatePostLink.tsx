import { Flex, Icon, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useDispatch } from "react-redux";
import { changeIsOpen } from "@/store/authModalSlice";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { BsLink45Deg } from "react-icons/bs";
import { changeIsOpenDirectory } from "@/store/communityDirectorySlice";

const CreatePostLink: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();

  const onClick = () => {
    if (!user) {
      dispatch(changeIsOpen(true));
      return;
    }

    const { communityId } = router.query;

    if (communityId) {
      router.push(`/r/${communityId}/Submit`);
      return;
    }

    // toggle community directory
    dispatch(changeIsOpenDirectory());

    dispatch(changeIsOpen);
  };

  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg="white"
      height="56px"
      p={2}
      mb={4}
      border="1px solid"
      borderColor="gray.300"
      borderRadius={4}
    >
      <Icon as={FaReddit} fontSize={36} color="gray.300" mr={4} />
      <Input
        placeholder="Create Post"
        height="36px"
        mr={4}
        bg="gray.50"
        borderColor="gray.200"
        borderRadius={4}
        fontSize="10pt"
        _placeholder={{ color: "gray.300" }}
        _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        onClick={onClick}
      />
      <Icon
        as={IoImageOutline}
        mr={2}
        fontSize={24}
        color="gray.300"
        cursor="pointer"
      />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.300" cursor="pointer" />
    </Flex>
  );
};
export default CreatePostLink;
