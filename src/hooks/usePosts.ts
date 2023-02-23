import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { deletePost, loadPosts, Post } from "../store/postsSlice";
import { deleteObject, ref } from "firebase/storage";
import { storage, fireStore } from "@/firebase/clientApp";
import { deleteDoc, doc } from "firebase/firestore";
const usePosts = () => {
  const dispatch = useDispatch();
  const postsStateValue = useSelector((state: RootState) => state.posts);

  const onVote = async () => {};
  const onSelectPost = () => {};
  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // check if there's an image
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      // delete the post document
      const postDocRef = doc(fireStore, "posts", post.id!);
      await deleteDoc(postDocRef);
      // update state
      dispatch(deletePost(post.id!));
      return true;
    } catch (error: any) {
      console.log("onDeletePost error", console.log(error.message));
      return false;
    }
  };
  const setPostsStateValue = (posts: Post[]) => {
    dispatch(loadPosts(posts));
  };

  return {
    postsStateValue,
    setPostsStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};

export default usePosts;
