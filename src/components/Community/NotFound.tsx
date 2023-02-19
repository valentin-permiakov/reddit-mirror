import { Box, Button, Flex, Highlight, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

type NotFoundProps = {
  communityName?: string;
};

const NotFound: React.FC<NotFoundProps> = ({ communityName = "that" }) => {
  return (
    <Flex direction="column" justify="center" align="center" minHeight="60vh">
      <Box>
        <Highlight
          query={`${communityName} community`}
          styles={{ color: "gray.500", fontWeight: 700 }}
        >
          {`Sorry, ${communityName} community does not exist or has been banned`}
        </Highlight>
      </Box>
      <Link href="/">
        <Button mt={4}>GO HOME</Button>
      </Link>
    </Flex>
  );
};
export default NotFound;
