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
  snippetsFetched: boolean;
}

const initialState: CommunityState = { mySnippets: [], snippetsFetched: false };

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
    updateCommunityMemberCount: (state, action: PayloadAction<number>) => {
      if (state.currentCommunity)
        state.currentCommunity.numberOfMembers += action.payload;
    },
    reset: (state) => {
      state.mySnippets = initialState.mySnippets;
    },
    changeSnippetsFetched: (state, action: PayloadAction<boolean>) => {
      state.snippetsFetched = action.payload;
    },
  },
});

export const {
  addCommunity,
  removeCommunity,
  updateCommunitySnippets,
  updateCurrentCommunity,
  updateCommunityImage,
  updateCommunityMemberCount,
  reset,
  changeSnippetsFetched,
} = communitiesSlice.actions;
