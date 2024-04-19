import PostFeed from "@/components/post-feed";
import PostForm from "@/components/post-form";
import React from "react";
import { Toaster } from "react-hot-toast";

const Page = () => {
  return (
    <div className="flex flex-col  items-center justify-center w-full">
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "dark:bg-dark border-2 dark:border-line/50 dark:text-white opacity-80",
        }}
      />
      <PostForm />
      <PostFeed />
    </div>
  );
};

export default Page;
