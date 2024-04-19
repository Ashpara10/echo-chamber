import { Post, User } from "@prisma/client";

import {
  Bookmark,
  Dot,
  Heart,
  MoreHorizontal,
  Reply,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import { getCookie } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
import url from "@/lib/url";
import toast, { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/query-client";
import { usePathname, useRouter } from "next/navigation";

interface PostProps extends Post {
  User: User;
}

moment.updateLocale("en", {
  relativeTime: {
    past: "%s",
    s: "%dsec",
    ss: "%dsec",
    m: "%d min",
    mm: "%d min",
    h: "%dh",
    hh: "%dh",
    d: "%dd",
    dd: "%dd",
    w: "%d week",
    ww: "%d weeks",
    M: "%d mon",
    MM: "%d mon",
    y: "%dyr",
    yy: "%dyr",
  },
});

const isImage = (exe: string) => {
  const imageExe = ["jpg", "jpeg", "png"];
  const isImg = imageExe.some((v) => v === exe);
  return isImg;
};

const PostCard = ({ data }: { data: PostProps }) => {
  const user = getCookie("user");
  const type = data.Image && data?.Image?.split(".");
  const exe = type?.[type?.length - 1];

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const resp = await fetch(`${url}/api/posts`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: id,
        }),
      });
      const res = await resp?.json();
      return res;
    },
  });

  const router = useRouter();

  return (
    <article className="w-full break-inside  md:max-w-sm  flex flex-col gap-x-4  mt-8   dark:bg-line/30  border-2 rounded-2xl overflow-hidden dark:border-line items-center justify-start ">
      {data?.Image &&
        (isImage(exe as string) ? (
          <div className="flex w-full items-center justify-center relative overflow-hidden">
            <Image
              alt={data?.caption as string}
              src={data?.Image as string}
              width={600}
              height={600}
              className="aspect-square w-full rounded-t-2xl border  dark:border-line"
              objectFit="cover"
              loading="lazy"
            />
          </div>
        ) : (
          <video
            width={600}
            height={600}
            autoPlay={true}
            controls={true}
            className="aspect-square w-full rounded-t-2xl border  dark:border-line"
          >
            <source src={data?.Image} />
          </video>
        ))}
      <div className="w-full flex flex-col px-4 py-3 items-center justify-start">
        <div className="w-full  flex items-start justify-between my-2">
          <div className="flex  items-center justify-start">
            <div className="w-fit">
              <Image
                src={data?.User?.image as string}
                alt={`${data?.User?.name} pfp`}
                width={50}
                height={50}
                className="aspect-square border dark:border-line rounded-full"
              />
            </div>
            <div className="w-full flex flex-col  leading-3 justify-center items-start ml-3 ">
              <span
                className="w-full text-left "
                onClick={() =>
                  data?.User?.id === user
                    ? router.push("/home/profile")
                    : router.push(`/home/profile/${data?.User?.id}`)
                }
              >
                {data?.User?.name}
              </span>
              <div className="w-full text-sm opacity-90 flex items-center justify-start">
                <span className=" ">@{data?.User?.username}</span>
                <Dot />
                <span className="">{moment(data?.createdAt).fromNow()}</span>
              </div>
            </div>
          </div>
        </div>

        <span
          onClick={() => router.push(`/home/post/${data?.id}`)}
          className="w-full flex-wrap opacity-80 my-2"
        >
          {data?.caption}
        </span>
      </div>
    </article>
  );
};

export default PostCard;
