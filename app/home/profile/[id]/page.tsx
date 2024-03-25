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
      <div className="w-full gap-y-3 my-3 flex items-center justify-center ">
        <div className="px-2">
          {isLoading ? (
            <div className="w-28 h-28 rounded-3xl dark:bg-line animate-pulse" />
          ) : (
            <Image
              className="aspect-square rounded-3xl"
              src={user?.image as string}
              width={120}
              height={120}
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-10 px-2 mt-2">
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
                  className="flex items-center relative justify-center group min-h-[200px]"
                >
                  <div className="w-full opacity-0 group-hover:opacity-100 duration-100 ease-in transition-all group-hover:flex hidden absolute top-2  px-2  group-hover:scale-100 scale-75 items-center justify-start z-10">
                    <Image
                      alt={data?.User?.name as string}
                      src={data?.User?.image as string}
                      width={35}
                      height={35}
                      className="aspect-square rounded-full"
                      objectFit="cover"
                      loading="lazy"
                    />
                    <div className="flex ml-2 flex-col items-start justify-center w-full">
                      <span className="text-sm">@{data?.User?.username}</span>
                    </div>
                  </div>
                  {data?.Image ? (
                    <motion.div className="relative overflow-hidden rounded-2xl">
                      <span className="group-hover:flex hidden z-10 opacity-100 absolute w-full h-full  items-center justify-center text-center">
                        {data?.caption}
                      </span>
                      <Image
                        alt={data?.caption as string}
                        src={data?.Image as string}
                        width={600}
                        height={600}
                        className="aspect-square group-hover:scale-125 transition-all duration-75 ease-in border group-hover:saturate-50 group-hover:opacity-50 dark:border-line"
                        objectFit="cover"
                        loading="lazy"
                      />
                    </motion.div>
                  ) : (
                    <div className="box border  w-full h-full dark:border-line rounded-2xl p-3">
                      <span className="group-hover:opacity-60 leading-snug tracking-tight">
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
