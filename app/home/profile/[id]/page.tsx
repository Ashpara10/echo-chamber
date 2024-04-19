"use client";
import PostCard from "@/components/post";
import { getPostsByID } from "@/lib/actions";
import useUser from "@/lib/useUser";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: { id: string } }) => {
  const { user, isLoading } = useUser({ id: params?.id });
  const router = useRouter();
  const { data: posts, isLoading: loading } = useQuery({
    queryKey: ["post-by-id", params?.id],
    queryFn: async () => getPostsByID(params?.id as string),
  });
  return (
    <div className="w-full flex flex-col ">
      <div className="w-full gap-y-3 my-3 py-3 flex items-center justify-center ">
        <div className="px-2">
          {isLoading ? (
            <div className="w-28 h-28 rounded-3xl dark:bg-line animate-pulse" />
          ) : (
            <Image
              className="aspect-square rounded-full"
              src={user?.image as string}
              width={100}
              height={100}
              alt={`${user?.username} pfp`}
            />
          )}
        </div>
        <div className="w-full flex ml-2 flex-col items-start justify-center">
          {isLoading ? (
            <div className="flex flex-col w-full gap-y-2">
              {[...Array(2)].map((_, i) => {
                return (
                  <span
                    key={i}
                    className="w-1/3 h-3 rounded-md dark:bg-line "
                  />
                );
              })}
            </div>
          ) : (
            <>
              {" "}
              <span className="w-full text-lg font-medium tracking-tight">
                {user?.name}
              </span>
            </>
          )}
          <span className="  opacity-75">@{user?.username}</span>
        </div>
      </div>

      <div className="border-t dark:border-line w-full">
        <div className="masonry sm:masonry-sm md:masonry-md w-full mt-6 px-3 ">
          {loading ? (
            [...Array(9)].map((_, i) => {
              return (
                <div
                  key={i}
                  className=" dark:bg-line aspect-square m-2 rounded-xl animate-pulse"
                />
              );
            })
          ) : posts?.length === 0 ? (
            <div>No Posts</div>
          ) : (
            posts?.map((data, i) => {
              return (
                <div
                  key={i}
                  onClick={() => router.push(`/home/post/${data?.id}`)}
                  className="flex items-center relative justify-center group my-2"
                >
                  {data?.Image ? (
                    <Image
                      alt={data?.User?.name as string}
                      src={data?.Image as string}
                      width={400}
                      height={400}
                      className="aspect-square my-2 rounded-3xl w-full"
                      objectFit="cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="border w-full min-h-[150px] flex items-center justify-center dark:border-line rounded-3xl  py-4 ">
                      <span className="px-4 opacity-80 flex-wrap">
                        {data?.caption}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
