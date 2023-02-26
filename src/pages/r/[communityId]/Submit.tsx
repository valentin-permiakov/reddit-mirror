import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Posts/NewPostForm";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import About from "@/components/Community/About";
import useCommunityData from "@/hooks/useCommunityData";

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);

  const { communityStateValue } = useCommunityData();

  return (
    <PageContent>
      <>
        <Box p="14px 0" borderBottom="1px solid white">
          <Text>Create a Post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};
export default SubmitPostPage;
