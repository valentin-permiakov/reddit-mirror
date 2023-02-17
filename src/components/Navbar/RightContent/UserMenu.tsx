import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
} from "@chakra-ui/react";
import { User, signOut } from "firebase/auth";
import React from "react";
import { FaRedditSquare } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { IoSparkles } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { auth } from "@/firebase/clientApp";
import { useDispatch } from "react-redux";
import { changeIsOpen } from "@/store/authModalSlice";

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const dispatch = useDispatch();
  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0 6px"
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
      >
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <Icon as={FaRedditSquare} mr={1} color="gray.300" fontSize={24} />
            ) : (
              <Icon as={VscAccount} mr={1} fontSize={24} color="gray.400" />
            )}
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{ bg: "blue.500", textColor: "white" }}
            >
              <Flex align="center">
                <Icon as={CgProfile} mr={2} fontSize={20} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{ bg: "blue.500", textColor: "white" }}
              onClick={() => signOut(auth)}
            >
              <Flex align="center">
                <Icon as={MdOutlineLogin} mr={2} fontSize={20} />
                Logout
              </Flex>
            </MenuItem>
          </>
        ) : (
          <MenuItem
            fontSize="10pt"
            fontWeight={700}
            _hover={{ bg: "blue.500", textColor: "white" }}
            onClick={() => dispatch(changeIsOpen(true))}
          >
            <Flex align="center">
              <Icon as={MdOutlineLogin} mr={2} fontSize={20} />
              Log In / Sign Up
            </Flex>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
