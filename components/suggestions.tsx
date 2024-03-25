"use client";
import url from "@/lib/url";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
const getSuggestedAccounts = async () => {
  const res = await fetch(`${url}/api/user/suggestions`, {
    cache: "force-cache",
  });
  const data = await res.json();
  return data;
};
const Suggestions = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => getSuggestedAccounts(),
  });
  // console.log({ data, error });
  return (
    <div className="flex w-full mt-10 max-w-xs flex-col items-center justify-center border dark:border-line rounded-2xl overflow-hidden">
      <span className="border-b dark:border-line text-lg font-medium w-full p-1 flex  items-center justify-center ">
        Suggestions
      </span>
      <ul className="w-full flex my-2 flex-col items-center justify-center ">
        {isLoading
          ? [...Array(5)].map((_, e) => {
              return (
                <div
                  key={e}
                  className="flex  last:border-none border-b dark:border-line w-full gap-x-3 px-3 py-1.5"
                >
                  <div className="w-fit">
                    <div className="w-12 h-12 rounded-full dark:bg-line animate-pulse " />
                  </div>
                  <div className="flex gap-y-3 flex-col items-center justify-center w-full ">
                    <div className="h-1.5 w-full px-2 dark:bg-line animate-pulse " />

                    <div className="h-1.5 w-full px-2 dark:bg-line animate-pulse " />
                  </div>
                </div>
              );
            })
          : data?.data?.map((e: User, i: number) => {
              return (
                <li
                  key={i}
                  className="flex max-w-lg last:border-none border-b dark:border-line w-full gap-x-3 px-3 py-1.5"
                >
                  <Image
                    src={e?.image as string}
                    alt={`${e?.name}-pfp`}
                    className="aspect-square rounded-full"
                    width={45}
                    height={45}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <span className="w-full text-sm ">{e?.name}</span>
                    <span className="w-full text-sm opacity-80">
                      @{e?.username}
                    </span>
                  </div>
                </li>
              );
            })}
      </ul>
    </div>
  );
};

export default Suggestions;
