"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import url from "@/lib/url";
import React, { useState } from "react";
import Image from "next/image";
import { IPost, TComment } from "@/lib/actions";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import moment from "moment";
import {
  Bookmark,
  Dot,
  Heart,
  Loader2,
  MessageCircle,
  SendHorizonal,
  Share2,
} from "lucide-react";
import CommentDrawer from "@/components/comment-drawer";
import useUser from "@/lib/useUser";
import { queryClient } from "@/lib/query-client";
import toast, { Toaster } from "react-hot-toast";

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

const getPostByID = async (id: string) => {
  console.log({ id });
  const res = await fetch(`${url}/api/${id}`);
  const resp = await res.json();
  if (!res.ok) {
    return resp;
  }
  return resp?.post as IPost;
};

const Page = ({ params }: { params: { id: string } }) => {
  const {
    data,
    error: postError,
    isLoading: isPostLoading,
  } = useQuery({
    queryKey: ["postByID", params?.id],
    queryFn: async () => await getPostByID(params?.id),
  });
  const {
    data: comments,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["comments", params?.id],
    queryFn: async () => {
      const res = await fetch(`${url}/api/posts/comments/${params?.id}`);
      const resp = await res.json();
      return resp?.comment as TComment[];
    },
  });
  if (error) {
    toast.error(error?.message);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async (comment: string) => {
      const res = await fetch(`${url}/api/posts/comments/${params?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caption: comment,
        }),
      });
      const resp = await res.json();
      return resp?.comment as TComment;
    },
  });
  const [comment, setComment] = useState("");
  const id = getCookie("user");
  const { user } = useUser({ id: id as string });
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className=" w-full   mt-6 mb-16 md:mb-2 flex flex-col gap-y-3 items-center justify-start">
      <Toaster
        position="top-center"
        toastOptions={{
          className: "dark:bg-dark border dark:border-line dark:text-white",
        }}
      />
      <CommentDrawer open={open} post={data?.id} />
      {error ? (
        error?.message
      ) : isLoading ? (
        <Loader2 className="animate-spin text-lg mt-4" />
      ) : (
        <>
          <div className="w-full px-4 flex items-center justify-between">
            <div className="w-fit ">
              <Image
                className={`aspect-square rounded-full`}
                src={data?.User?.image as string}
                width={50}
                height={50}
                alt={`${data?.User?.username}-profile`}
              />
            </div>
            <div className="w-full gap-y-1 ml-3 flex flex-col items-center justify-center">
              <div className="w-full flex items-start justify-between ">
                <div className="w-full flex flex-col  ">
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
                    <span className="">
                      {moment(data?.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center w-full px-4">
            <span className="opacity-90 mt-2 mb-4">{data?.caption}</span>
            {data?.Image && (
              <Image
                src={data?.Image as string}
                width={600}
                height={600}
                className="aspect-square rounded-lg border dark:border-line"
                alt=""
              />
            )}
          </div>
          <div className="border-y w-full py-3 mb-2 dark:border-line flex md:hidden items-center justify-evenly">
            <Heart />
            <MessageCircle onClick={() => setOpen(!open)} />
            <Bookmark />
            <Share2 />
          </div>

          <div className="px-4 pt-2 dark:bg-dark border-t dark:border-line  w-full hidden md:flex items-center justify-center">
            <div className="w-full flex gap-x-2 items-center justify-center">
              <input
                type="text"
                placeholder="Add a comment...."
                value={comment}
                onChange={(e) => setComment(e?.target?.value)}
                className="w-full focus-visible:outline-none  rounded-lg px-4 py-2.5 bg-transparent "
              />
              <button
                onClick={() => {
                  if (comment.length < 1) {
                    toast.error("comment cannot be null");
                    return;
                  }

                  mutate(comment, {
                    onError(error) {
                      toast.error(error?.message);
                    },
                    onSuccess(data) {
                      setComment("");
                      console.log({ data });
                      queryClient.refetchQueries({ queryKey: ["comments"] });
                    },
                  });
                }}
                className=" font-medium px-4 py-2 rounded-md opacity-80"
              >
                {isPending ? (
                  <Loader2 className="animate-spin opacity-90" />
                ) : (
                  <SendHorizonal />
                )}
              </button>
            </div>
          </div>
          <div className=" w-full hidden md:flex flex-col ">
            {isLoading ? (
              <div className="mt-4 flex w-full items-center justify-center ">
                <Loader2 className="animate-spin " />
              </div>
            ) : comments?.length === 0 ? (
              <div className="mt-8 w-full flex items-center justify-center">
                No comments on this post 🥱
              </div>
            ) : (
              comments?.map((c, i) => {
                return (
                  <div
                    key={i}
                    className="flex first:border-t border-b dark:border-line px-3 py-2  w-full items-center justify-center"
                  >
                    <Image
                      className={`aspect-square rounded-full`}
                      src={c?.User?.image as string}
                      width={40}
                      height={40}
                      alt={`${c?.User?.username}-profile`}
                    />
                    <div className=" ml-3 w-full flex flex-col  ">
                      <div className="w-full text-sm opacity-80 flex items-center justify-start">
                        <span
                          className=" "
                          onClick={() =>
                            c?.User?.id === id
                              ? router.push("/home/profile")
                              : router.push(`/home/profile/${c?.User?.id}`)
                          }
                        >
                          @{c?.User.username}
                        </span>
                        <Dot />

                        <span className="">
                          {moment(c?.timestamp).fromNow()}
                        </span>
                      </div>
                      <span className="px-1 text-sm">{c?.content}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
