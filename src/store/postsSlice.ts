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
  imageURL?: string;
  communityImageURL?: string;
  createdAt: { seconds: number; nanoseconds: number };
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
  reducers: {
    loadPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
});

export const { loadPosts, deletePost } = postsSlice.actions;
