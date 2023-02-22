/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  addCommunity,
  Community,
  CommunitySnippet,
  removeCommunity,
  updateCommunitySnippets,
} from "../store/communitiesSlice";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, fireStore } from "@/firebase/clientApp";
import { changeIsOpen, changeView } from "@/store/authModalSlice";
import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";

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
    if (!user) {
      dispatch(changeIsOpen(true));
      return;
    }

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
    } catch (error: any) {
      console.log("getMySnippets error", error.message);
      setError(error.message);
    }
    setisLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    // batch write
    try {
      const batch = writeBatch(fireStore);
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
      };

      // creating a new community snippet for the user
      batch.set(
        doc(
          fireStore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      // update the number of members for the community
      batch.update(doc(fireStore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      // update client state
      dispatch(addCommunity(newSnippet));
    } catch (error: any) {
      console.log("joinCommunity error", error.message);
      setError(error.message);
    }

    setisLoading(false);
  };
  const leaveCommunity = async (communityId: string) => {
    // batch write
    try {
      const batch = writeBatch(fireStore);

      // removing the community snippet from the user
      batch.delete(
        doc(fireStore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      // update the number of members for the community
      batch.update(doc(fireStore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      // update client state
      dispatch(removeCommunity(communityId));
    } catch (error: any) {
      console.log("leaveCommunity error", error.message);
      setError(error.message);
    }
    setisLoading(false);
  };

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
