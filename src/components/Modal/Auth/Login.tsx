import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changeView } from "@/store/authModalSlice";

const Login: React.FC = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const onSubmit = () => {};
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="email"
        type="email"
        onChange={onChange}
        mb={4}
        bg="gray.50"
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          background: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          background: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
      />
      <Input
        required
        name="password"
        placeholder="password"
        type="password"
        onChange={onChange}
        mb={6}
        bg="gray.50"
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          background: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          background: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
      />
      <Button type="submit" width="100%" height="36px" mb={4}>
        Log In
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>New Here?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() => dispatch(changeView("signup"))}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
};
export default Login;
