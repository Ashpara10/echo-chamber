import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "./ui/drawer";
import Image from "next/image";
import { getCookie } from "cookies-next";
import useUser from "@/lib/useUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import url from "@/lib/url";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Dot, Loader2, Send, SendHorizonal } from "lucide-react";
import { queryClient } from "@/lib/query-client";
import toast, { Toaster } from "react-hot-toast";
import { TComment } from "@/lib/actions";

const CommentDrawer = ({ open, post }: { open: boolean; post: string }) => {
  const id = getCookie("user");
  const [comment, setComment] = useState("");
  const { user } = useUser({ id: id as string });

  const { data, error, isLoading } = useQuery({
    queryKey: ["comments", post],
    queryFn: async () => {
      const res = await fetch(`${url}/api/posts/comments/${post}`);
      const resp = await res.json();
      return resp?.comment as TComment[];
    },
  });
  if (error) {
    toast.error(error?.message);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async (comment: string) => {
      const res = await fetch(`${url}/api/posts/comments/${post}`, {
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
  const router = useRouter();
  return (
    <Drawer direction="bottom" open={open}>
      <DrawerOverlay />
      <DrawerContent className="min-h-[500px] flex md:hidden flex-col w-full rounded-t-2xl justify-between border-t dark:border-line">
        <DrawerHeader>
          <DrawerTitle>Comments </DrawerTitle>
        </DrawerHeader>
        <div className="h-[400px] overflow-y-scroll scrollbar-thin w-full flex flex-col ">
          {isLoading ? (
            [...Array(10)].map((_, i) => {
              return (
                <div
                  key={i}
                  className="w-full h-8 animate-pulse rounded-md my-1 bg-line"
                ></div>
              );
            })
          ) : data?.length === 0 ? (
            <div className="mt-8 w-full flex items-center justify-center">
              No comments on this post 🥱
            </div>
          ) : (
            data?.map((c, i) => {
              return (
                <div
                  key={i}
                  onClick={() =>
                    c?.User?.id === id
                      ? router.push("/home/profile")
                      : router.push(`/home/profile/${c?.User?.id}`)
                  }
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
                      <span className=" ">@{c?.User.username}</span>
                      <Dot />

                      <span className="">{moment(c?.timestamp).fromNow()}</span>
                    </div>
                    <span className="px-1 text-sm">{c?.content}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="px-3 pt-2 dark:bg-dark border-t dark:border-line mb-2 gap-2 w-full flex items-center justify-center">
          <div className="w-fit">
            <Image
              src={user?.image as string}
              width={50}
              height={50}
              alt=""
              className="rounded-full aspect-square"
            />
          </div>
          <div className="w-full flex gap-x-2 items-center justify-center">
            <input
              type="text"
              placeholder="Add a comment...."
              value={comment}
              onChange={(e) => setComment(e?.target?.value)}
              className="w-full focus-visible:outline-none px-2 py-2.5 dark:bg-transparent "
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
      </DrawerContent>
    </Drawer>
  );
};

export default CommentDrawer;
