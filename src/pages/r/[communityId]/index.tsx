/* eslint-disable react-hooks/exhaustive-deps */
import CreatePostLink from "@/components/Community/CreatePostLink";
import Header from "@/components/Community/Header";
import NotFound from "@/components/Community/NotFound";
import PageContent from "@/components/Layout/PageContent";
import Posts from "@/components/Posts/Posts";
import { fireStore } from "@/firebase/clientApp";
import { Community, updateCurrentCommunity } from "@/store/communitiesSlice";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import safeJsonStringify from "safe-json-stringify";
import About from "../../../components/Community/About";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!communityData.id) return;
    dispatch(updateCurrentCommunity(communityData));
  }, [communityData]);

  if (!communityData.id) {
    return <NotFound communityName={communityData as unknown as string} />;
  }
  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      fireStore,
      "communities",
      ctx.query.communityId as string
    );

    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({
                id: communityDoc.id,
                ...communityDoc.data(),
                createdAt: {
                  seconds: communityDoc.data().createdAt.seconds,
                  nanoseconds: communityDoc.data().createdAt.nanoseconds,
                },
              })
            )
          : ctx.query.communityId,
      },
    };
  } catch (error) {
    // could add error page
    console.log("getServerSideProps error", error);
  }
}
export default CommunityPage;
