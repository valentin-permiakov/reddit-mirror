import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import React from "react";

type TextInputsProps = {
  textInputs: {
    title: string;
    body: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  isLoading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  onChange,
  handleCreatePost,
  isLoading,
}) => {
  return (
    <Stack spacing={3} width="100%">
      <Input
        name="title"
        value={textInputs.title}
        onChange={onChange}
        fontSize="10pt"
        placeholder="Title"
        _placeholder={{ color: "gray.500" }}
        _focus={{ outline: "none", bg: "white", border: "1px solid black" }}
      />
      <Textarea
        name="body"
        value={textInputs.body}
        onChange={onChange}
        height="100px"
        fontSize="10pt"
        placeholder="Text (optional)"
        _placeholder={{ color: "gray.500" }}
        _focus={{ outline: "none", bg: "white", border: "1px solid black" }}
      />
      <Flex justify="flex-end">
        <Button
          height="34px"
          p="0 30px"
          isDisabled={!textInputs.title}
          onClick={handleCreatePost}
          isLoading={isLoading}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};
export default TextInputs;
