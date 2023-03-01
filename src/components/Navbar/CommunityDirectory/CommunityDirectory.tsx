import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Icon,
  Text,
  Image,
} from "@chakra-ui/react";
import { TiHome } from "react-icons/ti";
import React from "react";
import Communities from "./Communities";
import useDirectory from "../../../hooks/useDirectory";
import { FaReddit } from "react-icons/fa";

const CommunityDirectory: React.FC = () => {
  const { directoryState, toggleMenuOpen } = useDirectory();

  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        cursor="pointer"
        padding="0 6px"
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        onClick={toggleMenuOpen}
      >
        <Flex
          align="center"
          justify="space-between"
          width={{ base: "auto", lg: "200px" }}
        >
          <Flex align="center">
            {/* <Icon as={TiHome} fontSize={24} mr={{ base: 1, md: 2 }} /> */}
            {directoryState.selectedMenuItem.displayText === "HOME" ? (
              <Icon as={TiHome} fontSize={24} mr={{ base: 1, md: 2 }} />
            ) : directoryState.selectedMenuItem.imageURL ? (
              <Image
                src={directoryState.selectedMenuItem.imageURL}
                alt="community avatar"
                borderRadius="full"
                boxSize="24px"
                mr={{ base: 1, md: 2 }}
              />
            ) : (
              <Icon
                as={FaReddit}
                fontSize={24}
                mr={{ base: 1, md: 2 }}
                color={directoryState.selectedMenuItem.iconColor}
              />
            )}

            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight={600} fontSize="10pt">
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default CommunityDirectory;
