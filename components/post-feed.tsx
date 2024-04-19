"use client";
import React from "react";
import PostCard from "./post";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getPosts } from "@/lib/actions";

const PostFeed = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => getPosts(),
  });
  console.log({ data });

  return isLoading ? (
    <div className="w-full mt-4 flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  ) : (
    <div className="masonry sm:masonry-sm md:masonry-md w-full mt-6 px-3 ">
      {data?.map((post: any, i: number) => {
        return <PostCard key={i} data={post as any} />;
      })}
    </div>
  );
};

export default PostFeed;
