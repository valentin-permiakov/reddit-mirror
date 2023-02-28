/* eslint-disable react-hooks/exhaustive-deps */
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { fireStore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { Community, updateCurrentCommunity } from "@/store/communitiesSlice";
import safeJsonStringify from "safe-json-stringify";
import NotFound from "@/components/Community/NotFound";
import Header from "@/components/Community/Header";
import PageContent from "@/components/Layout/PageContent";
import CreatePostLink from "@/components/Community/CreatePostLink";
import Posts from "@/components/Posts/Posts";
import { useDispatch, useSelector } from "react-redux";
import About from "../../../components/Community/About";
import { RootState } from "@/store/store";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!communityData.id) return;
    dispatch(updateCurrentCommunity(communityData));
  }, []);

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
