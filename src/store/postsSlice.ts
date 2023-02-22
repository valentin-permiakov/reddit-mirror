import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";

export type Post = {
  id?: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  imgURL?: string;
  communityImgURL?: string;
  createdAt: Timestamp;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  // postVotes
}

const initialState: PostState = {
  selectedPost: null,
  posts: [],
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
});
