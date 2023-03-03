import About from "@/components/Community/About";
import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Posts/NewPostForm";
import { auth } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import { Box, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const SubmitPostPage: NextPage = () => {
  const [user] = useAuthState(auth);

  const { communityStateValue } = useCommunityData();

  return (
    <PageContent>
      <>
        <Box p="14px 0" borderBottom="1px solid white">
          <Text>Create a Post</Text>
        </Box>
        {user && (
          <NewPostForm
            user={user}
            communityImageURL={communityStateValue.currentCommunity?.imageURL}
          />
        )}
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
