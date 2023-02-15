import { RootState } from "@/store/store";
import { Flex } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import Login from "./Login";
import SignUp from "./SignUp";

type AuthInputsProps = {};

const AuthInputs: React.FC<AuthInputsProps> = () => {
  const modalView = useSelector((state: RootState) => state.authModal.view);
  return (
    <Flex direction="column" align="center" width="100%" mt={4}>
      {modalView === "login" && <Login />}
      {modalView === "signup" && <SignUp />}
    </Flex>
  );
};
export default AuthInputs;
