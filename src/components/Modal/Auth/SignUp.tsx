import { auth } from "@/firebase/clientApp";
import { changeView } from "@/store/authModalSlice";
import { Input, Button, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "@/firebase/errors";

const SignUp: React.FC = () => {
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();

  const [createUserWithEmailAndPassword, user, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formError) setFormError("");
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    // passwords match
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
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
      <Input
        required
        name="confirmPassword"
        placeholder="confirm password"
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
      {(formError || userError) && (
        <Text textAlign="center" color="red" fontSize="10pt">
          {(formError ||
            FIREBASE_ERRORS[userError?.code as keyof typeof FIREBASE_ERRORS]) ??
            "An error occured"}
        </Text>
      )}
      <Button
        type="submit"
        width="100%"
        height="36px"
        mb={4}
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() => dispatch(changeView("login"))}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};
export default SignUp;
