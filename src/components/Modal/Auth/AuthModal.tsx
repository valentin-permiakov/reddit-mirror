import { changeIsOpen } from "@/store/authModalSlice";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";

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
          <ModalHeader>{modalState.view}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>MODAL!!</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
