/* eslint-disable react-hooks/exhaustive-deps */
import {
  changeIsOpenDirectory,
  changeSelectedMenuItem,
  DirectoryMenuItem,
} from "@/store/communityDirectorySlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useDirectory = () => {
  const directoryState = useSelector(
    (state: RootState) => state.communityDirectory
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const communityStateValue = useSelector(
    (state: RootState) => state.communities
  );

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    dispatch(changeSelectedMenuItem(menuItem));
    router.push(menuItem.link);

    if (directoryState.isOpen) dispatch(changeIsOpenDirectory());
  };

  const toggleMenuOpen = () => {
    dispatch(changeIsOpenDirectory());
  };

  useEffect(() => {
    const { currentCommunity } = communityStateValue;

    if (currentCommunity) {
      dispatch(
        changeSelectedMenuItem({
          displayText: `r/${currentCommunity.id}`,
          link: `/r/${currentCommunity.id}`,
          imageURL: currentCommunity.imageURL,
          iconColor: "blue.500",
        })
      );
    }
  }, [communityStateValue.currentCommunity]);

  return { directoryState, toggleMenuOpen, onSelectMenuItem };
};
export default useDirectory;
