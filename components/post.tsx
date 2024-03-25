import { Post, User } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  Bookmark,
  Dot,
  Loader2,
  MoreHorizontal,
  Reply,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import { getCookie } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
import url from "@/lib/url";
import toast, { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/query-client";
import { usePathname, useRouter } from "next/navigation";
import { BookmarkContext } from "./bookmarks";

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

const PostCard = ({ data }: { data: PostProps }) => {
  const user = getCookie("user");
  const path = usePathname();
  const onProfile = path.includes("/profile");
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
  const { addBookmark, isBookmarked, removeBookmark } = useContext(
    BookmarkContext
  ) as {
    bookmarks: string[];
    addBookmark: (id: string) => void;
    isBookmarked: (id: string) => boolean;
    removeBookmark: (id: string) => string[];
  };
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <article className="flex flex-col gap-x-4 px-4 mt-8 pb-6 border-b dark:border-line items-start justify-center ">
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "dark:bg-dark border dark:border-line shadow-none dark:text-white",
        }}
      />

      <div className="w-full gap-y-3 flex flex-col items-center justify-center">
        <div className="w-full flex items-start justify-between ">
          <div className="flex items-center justify-start">
            <div className="w-fit">
              <Image
                src={data?.User?.image as string}
                alt={`${data?.User?.name} pfp`}
                width={70}
                height={70}
                className="aspect-square border dark:border-line rounded-full"
              />
            </div>
            <div className="w-full flex flex-col justify-center items-start ml-3 ">
              <span
                className=" text-left "
                onClick={() =>
                  data?.User?.id === user
                    ? router.push("/home/profile")
                    : router.push(`/home/profile/${data?.User?.id}`)
                }
              >
                {data?.User.name}
              </span>
              <div className="w-full opacity-80 flex items-center justify-start">
                <span className=" ">@{data?.User.username}</span>
                <Dot />
                <span className="">{moment(data?.createdAt).fromNow()}</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl  -translate-x-3 py-2 dark:bg-dark border dark:border-line">
              <DropdownMenuItem className="gap-x-3 hover:dark:bg-line rounded-lg">
                <Reply className="opacity-80 size-5" /> Comment
              </DropdownMenuItem>

              <DropdownMenuSeparator className="dark:bg-line" />

              <DropdownMenuItem
                className="gap-x-3 hover:dark:bg-line rounded-lg"
                onClick={() => {
                  if (isBookmarked(data?.id)) removeBookmark(data?.id);
                  addBookmark(data?.id);
                }}
              >
                {!isBookmarked(data?.id) ? (
                  <>
                    <Bookmark className="  opacity-80 size-5" />
                    Bookmark
                  </>
                ) : (
                  <>
                    <X className="  opacity-80 size-5" /> Remove
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator className="dark:bg-line" />
              <DropdownMenuItem className="gap-x-3 hover:dark:bg-line rounded-lg">
                <Share2 className="opacity-80 size-5" /> Share
              </DropdownMenuItem>
              {data?.User?.id === user && (
                <>
                  <DropdownMenuSeparator className="dark:bg-line " />
                  <DropdownMenuItem
                    onClick={() => {
                      mutate(data?.id as string, {
                        onSuccess: (data) => {
                          console.log({ data });
                          queryClient.refetchQueries({ queryKey: ["posts"] });
                          toast.success("post deleted");
                        },
                        onError: (err) => {
                          console.log({ err });
                          toast.error(err?.message);
                        },
                      });
                    }}
                    className="gap-x-3 hover:dark:bg-black/20 text-red-500  rounded-lg"
                  >
                    <Trash2 className="opacity-80 size-5" /> Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className="w-full flex flex-col gap-y-3 "
          onClick={() => router.push(`/home/post/${data?.id}`)}
        >
          <span className="mx-4 opacity-90 text-sm my-2">{data?.caption}</span>
          {data?.Image && (
            <Image
              alt={data?.caption as string}
              src={data?.Image as string}
              width={600}
              height={600}
              className="aspect-square rounded-2xl border dark:border-line"
              objectFit="cover"
              loading="lazy"
            />
          )}
          {/* <div className="w-full mt-3  flex items-center justify-evenly">
            <Heart />
            <MessageCircle />
            <Bookmark />
            <Eye />
          </div> */}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
