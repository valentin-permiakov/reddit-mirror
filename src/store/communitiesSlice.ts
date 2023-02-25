import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restricted" | "private";
  createdAt?: { seconds: number; nanoseconds: number };
  imageURL?: string;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface CommunityState {
  mySnippets: CommunitySnippet[];
  currentCommunity?: Community;
}

const initialState: CommunityState = { mySnippets: [] };

export const communitiesSlice = createSlice({
  name: "communities",
  initialState,
  reducers: {
    addCommunity: (state, action: PayloadAction<CommunitySnippet>) => {
      state.mySnippets.push(action.payload);
    },
    removeCommunity: (state, action: PayloadAction<string>) => {
      state.mySnippets = state.mySnippets.filter(
        (snippet) => snippet.communityId !== action.payload
      );
    },
    updateCommunitySnippets: (
      state,
      action: PayloadAction<CommunitySnippet[]>
    ) => {
      state.mySnippets = action.payload;
    },
    updateCurrentCommunity: (state, action: PayloadAction<Community>) => {
      state.currentCommunity = action.payload;
    },
    updateCommunityImage: (state, action: PayloadAction<string>) => {
      if (state.currentCommunity)
        state.currentCommunity.imageURL = action.payload;
    },
    reset: (state) => {
      state.mySnippets = initialState.mySnippets;
    },
  },
});

export const {
  addCommunity,
  removeCommunity,
  updateCommunitySnippets,
  updateCurrentCommunity,
  updateCommunityImage,
  reset,
} = communitiesSlice.actions;
