import PostFeed from "@/components/post-feed";
import PostForm from "@/components/post-form";

import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col  items-start justify-center w-full">
      <PostForm />
      <PostFeed />
    </div>
  );
};

export default Page;
