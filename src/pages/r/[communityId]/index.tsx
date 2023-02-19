import { GetServerSidePropsContext } from "next";
import React from "react";
import { fireStore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { Community } from "@/store/communitiesSlice";
import safeJsonStringify from "safe-json-stringify";
import NotFound from "@/components/Community/NotFound";
import Header from "@/components/Community/Header";
import PageContent from "@/components/Layout/PageContent";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  if (!communityData.id) {
    console.log(communityData);
    return <NotFound communityName={communityData as unknown as string} />;
  }
  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <div>LHS</div>
        </>
        <>
          <div>RHS</div>
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
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data })
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
