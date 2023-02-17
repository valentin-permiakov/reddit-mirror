import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image
          src="/images/googlelogo.png"
          alt="google logo"
          height="20px"
          mr={1}
        />
        Continue with Google
      </Button>
      {error && (
        <Text textAlign="center" color="red" fontSize="10pt">
          {FIREBASE_ERRORS[error?.code as keyof typeof FIREBASE_ERRORS] ??
            "An error occured"}
        </Text>
      )}
    </Flex>
  );
};
export default OAuthButtons;
