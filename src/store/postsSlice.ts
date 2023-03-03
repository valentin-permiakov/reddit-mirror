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

export type PostVote = {
  id: string;
  postId: string;
  communityId: string;
  voteValue: number;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[];
}

const initialState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    loadPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    updatePosts: (state, action: PayloadAction<Post[]>) => {
      action.payload.forEach((post) => state.posts.push(post));
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    loadPostVotes: (state, action: PayloadAction<PostVote[]>) => {
      state.postVotes = action.payload;
    },
    selectPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload;
    },
    updateCommentCount: (state, action: PayloadAction<number>) => {
      state.selectedPost!.numberOfComments += action.payload;
    },
  },
});

export const {
  loadPosts,
  updatePosts,
  deletePost,
  loadPostVotes,
  selectPost,
  updateCommentCount,
} = postsSlice.actions;
