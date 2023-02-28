import { changeIsOpen, changeView } from "@/store/authModalSlice";
import { Button } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";

const AuthButtons: React.FC = () => {
  const dispatch = useDispatch();

  const handleClick = (view: "login" | "signup" | "resetPassword") => {
    dispatch(changeIsOpen(true));
    dispatch(changeView(view));
  };
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => {
          handleClick("login");
        }}
      >
        Log In
      </Button>
      <Button
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => {
          handleClick("signup");
        }}
      >
        Sign up
      </Button>
    </>
  );
};
export default AuthButtons;
