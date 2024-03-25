"use client";
import React from "react";
import PostCard from "./post";
import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getPosts } from "@/lib/actions";

const PostFeed = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => getPosts(),
  });
  console.log({ error });

  return isLoading ? (
    <div className="w-full mt-4 flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  ) : (
    <div className="flex flex-col w-full">
      {data?.map((post: any, i: number) => {
        return <PostCard key={i} data={post as any} />;
      })}
    </div>
  );
};

export default PostFeed;
