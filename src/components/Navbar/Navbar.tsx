import { auth } from "@/firebase/clientApp";
import { Flex, Image } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import CommunityDirectory from "./CommunityDirectory/CommunityDirectory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";
import useDirectory from "../../hooks/useDirectory";
import { defaultMenuItem } from "../../store/communityDirectorySlice";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();
  return (
    <Flex
      bg="white"
      height="50px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        <Image src="/images/redditFace.svg" alt="reddit logo" height="30px" />
        <Image
          src="/images/redditText.svg"
          alt="reddit logo"
          height="46px"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      {user && <CommunityDirectory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
