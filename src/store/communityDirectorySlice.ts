import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IconType } from "react-icons";
import { TiHome } from "react-icons/ti";

export type DirectoryMenuItem = {
  displayText: string;
  link: string;
  iconColor: string;
  imageURL?: string;
};

interface DirectoryMenuState {
  isOpen: boolean;
  selectedMenuItem: DirectoryMenuItem;
}

export const defaultMenuItem: DirectoryMenuItem = {
  displayText: "HOME",
  link: "/",
  iconColor: "black",
};

export const initialState: DirectoryMenuState = {
  isOpen: false,
  selectedMenuItem: defaultMenuItem,
};

export const communityDirectorySlice = createSlice({
  name: "communityDirectory",
  initialState,
  reducers: {
    changeIsOpenDirectory: (state) => {
      state.isOpen = !state.isOpen;
    },
    changeSelectedMenuItem: (
      state,
      action: PayloadAction<DirectoryMenuItem>
    ) => {
      state.selectedMenuItem = action.payload;
    },
  },
});

export const { changeIsOpenDirectory, changeSelectedMenuItem } =
  communityDirectorySlice.actions;
