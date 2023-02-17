import { auth } from "@/firebase/clientApp";
import { Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { BsReddit, BsDot } from "react-icons/bs";
import { changeView } from "@/store/authModalSlice";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  const dispatch = useDispatch();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendPasswordResetEmail(email);
    setSuccess(true);
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
      <Text fontWeight={700} mb={2}>
        Reset your password
      </Text>
      {success ? (
        <Text mb={4}>Check your email</Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb={2}>
            Enter the email asssociated with your account and we&apos;ll send
            you a reset link
          </Text>
          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <Input
              required
              name="email"
              placeholder="email"
              type="email"
              autoComplete="email"
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
            <Text textAlign="center" fontSize="10pt" color="red">
              {error?.message}
            </Text>
            <Button
              width="100%"
              height="36px"
              mb={2}
              mt={2}
              type="submit"
              isLoading={sending}
            >
              Reset Password
            </Button>
          </form>
        </>
      )}
      <Flex
        alignItems="center"
        fontSize="9pt"
        color="blue.500"
        fontWeight={700}
        cursor="pointer"
      >
        <Text onClick={() => dispatch(changeView("login"))}>LOGIN</Text>
        <Icon as={BsDot} />
        <Text onClick={() => dispatch(changeView("signup"))}>SIGN UP</Text>
      </Flex>
    </Flex>
  );
};
export default ResetPassword;
