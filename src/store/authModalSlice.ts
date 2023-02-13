import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthModalState {
  isOpen: boolean;
  view: "login" | "signup" | "resetPassword";
}

export const initialState: IAuthModalState = {
  isOpen: false,
  view: "login",
};

export const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    changeIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    changeView: (
      state,
      action: PayloadAction<"login" | "signup" | "resetPassword">
    ) => {
      state.view = action.payload;
    },
  },
});

export const { changeIsOpen, changeView } = authModalSlice.actions;
