import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restricted" | "private";
  createdAt?: Timestamp;
  imageURL?: string;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface CommunityState {
  mySnippets: CommunitySnippet[];
  // visitedCommunities
}

const initialState: CommunityState = { mySnippets: [] };

export const communitiesSlice = createSlice({
  name: "communities",
  initialState,
  reducers: {
    addCommunity: (state, action: PayloadAction<CommunitySnippet>) => {
      state.mySnippets.push(action.payload);
    },
    updateCommunitySnippets: (
      state,
      action: PayloadAction<CommunitySnippet[]>
    ) => {
      state.mySnippets = action.payload;
    },
    reset: () => initialState,
  },
});

export const { addCommunity, updateCommunitySnippets, reset } =
  communitiesSlice.actions;
