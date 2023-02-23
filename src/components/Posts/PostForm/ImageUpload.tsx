import { Button, Flex, Image, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";

type ImageUploadProps = {
  selectedFile?: string;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  onSelectImage,
  setSelectedFile,
  setSelectedTab,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);
  return (
    <Flex direction="column" justify="center" align="center" width="100%">
      {selectedFile ? (
        <>
          <Image
            src={selectedFile}
            alt="uploaded image"
            maxWidth="400px"
            maxHeight="400px"
          />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectedTab("Post")}>
              Back to Post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Flex
            justify="center"
            align="center"
            width="100%"
            p={20}
            border="1px dashed"
            borderColor="gray.200"
            borderRadius={4}
          >
            <Button
              variant="outline"
              height="28px"
              onClick={() => selectedFileRef.current?.click()}
            >
              Upload
            </Button>
            <input
              ref={selectedFileRef}
              type="file"
              onChange={onSelectImage}
              accept="image/*, video/*"
              hidden
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};
export default ImageUpload;
