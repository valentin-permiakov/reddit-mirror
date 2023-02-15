import { changeIsOpen } from "@/store/authModalSlice";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import AuthInputs from "./AuthInputs";
import OAuthButtons from "./OAuthButtons";

const AuthModal: React.FC = () => {
  const modalState = useSelector((state: RootState) => state.authModal);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(changeIsOpen(false));
  };
  return (
    <>
      <Modal isOpen={modalState.isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalState.view === "login" && "Login"}
            {modalState.view === "signup" && "Sign Up"}
            {modalState.view === "resetPassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={6}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              width="70%"
            >
              <OAuthButtons />
              <Text color="gray.400" fontWeight={500}>
                OR
              </Text>
              <AuthInputs />
              {/* <ResetPassword /> */}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
