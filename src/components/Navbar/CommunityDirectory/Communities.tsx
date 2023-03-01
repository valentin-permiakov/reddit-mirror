import CreateCommunityModal from "@/components/Modal/CreateCommunity/CreateCommunityModal";
import { changeIsOpenDirectory } from "@/store/communityDirectorySlice";
import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { useSelector, useDispatch } from "react-redux";
import useCommunityData from "../../../hooks/useCommunityData";
import { RootState } from "../../../store/store";
import MenuListItem from "./MenuListItem";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mySnippets = useSelector(
    (state: RootState) => state.communities.mySnippets
  );
  const dispatch = useDispatch();
  useCommunityData();
  return (
    <>
      <CreateCommunityModal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              icon={FaReddit}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              iconColor={"brand.100"}
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => {
            setIsOpen(true);
            dispatch(changeIsOpenDirectory());
          }}
        >
          <Flex align="center">
            <Icon as={GrAdd} mr={1} fontSize={20} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={FaReddit}
            displayText={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            iconColor={"blue.500"}
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
};
export default Communities;
