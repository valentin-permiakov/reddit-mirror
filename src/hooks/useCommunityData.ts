/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  addCommunity,
  Community,
  CommunitySnippet,
  updateCommunitySnippets,
} from "../store/communitiesSlice";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, fireStore } from "@/firebase/clientApp";
import { collection, getDocs } from "firebase/firestore";

const useCommunityData = () => {
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const communityStateValue = useSelector(
    (state: RootState) => state.communities
  );
  const dispatch = useDispatch();

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // is the user signed in?

    // Are they joined?
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }

    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setisLoading(true);

    try {
      const snippetDocs = await getDocs(
        collection(fireStore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

      dispatch(updateCommunitySnippets(snippets as CommunitySnippet[]));
    } catch (error) {
      console.log("getMySnippets error", error);
    }
    setisLoading(false);
  };

  const joinCommunity = (communityData: Community) => {};
  const leaveCommunity = (communityId: string) => {};

  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    isLoading,
  };
};
export default useCommunityData;
