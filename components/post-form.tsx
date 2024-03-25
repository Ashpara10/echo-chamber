"use client";
import { queryClient } from "@/lib/query-client";
import supabase from "@/lib/supabase";
import url from "@/lib/url";
import useUser from "@/lib/useUser";
import { Post } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { ImageIcon, Loader2, Smile, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

const addPost = async ({ post }: { post: Pick<Post, "Image" | "caption"> }) => {
  const res = await fetch(`${url}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      !post?.Image
        ? { caption: post?.caption }
        : {
            caption: post?.caption,
            Image: post?.Image,
          }
    ),
  });
  const data = await res.json();
  return data;
};

const PostForm = () => {
  const id = getCookie("user");
  const [emoji, setEmoji] = useState(false);
  const [show, setShow] = useState(false);
  const { user, error, isLoading } = useUser({ id: id as string });

  const [post, setPost] = useState<{ caption: string; image: File | null }>({
    caption: "",
    image: null,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (post: Pick<Post, "Image" | "caption">) => addPost({ post }),
  });
  const handleSubmit = async () => {
    console.log({ post });
    const user = getCookie("user");
    if (post?.image) {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`${user}-${post?.image?.name}` as string, post?.image as File);
      console.log({ data, error });
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(data?.path as string);

      mutate(
        { caption: post?.caption, Image: publicUrl as string },
        {
          onError: (err) => toast.error(err?.message),
          onSuccess: async () => {
            setPost({ caption: "", image: null });
            toast.success("Successfully posted");
            await queryClient.refetchQueries({ queryKey: ["posts"] });
          },
        }
      );
      return;
    }
    mutate(
      { caption: post?.caption, Image: null },
      {
        onError: (err) => toast.error(err?.message),
        onSuccess: async (data) => {
          setPost({ caption: "", image: null });
          toast.success("Successfully posted");
          await queryClient.refetchQueries({ queryKey: ["posts"] });
        },
      }
    );
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files && e.target.files[0]) {
      setPost({ ...post, image: e.target.files[0] });
    }
  };

  return (
    <div className="w-full pb-2 group flex justify-center items-start px-3 border-b dark:border-line mt-8">
      <div className="flex  w-fit items-center justify-center h-full">
        {isLoading ? (
          <div className="w-12 h-12 rounded-full animate-pulse dark:bg-line" />
        ) : (
          <Image
            className={`aspect-square rounded-full  `}
            alt={`${user?.name}-profile`}
            src={user?.image as string}
            width={60}
            height={60}
            quality={80}
          />
        )}
      </div>
      <div className="w-full group flex flex-col ml-6  items-center justify-center">
        <TextareaAutosize
          value={post?.caption}
          onClick={() => setShow(!show)}
          onChange={(e) =>
            setPost({ ...post, caption: e?.target?.value as string })
          }
          placeholder="What's on your mind?"
          minRows={3}
          className="w-full bg-transparent appearance-none resize-none focus-visible:outline-none"
        />
        <div className="flex w-full ">
          {post?.image && (
            <div className="rounded-2xl  relative overflow-hidden border dark:border-line">
              <span
                onClick={() => setPost({ ...post, image: null })}
                className="absolute top-3 left-3 rounded-full p-0.5  bg-white"
              >
                <X className="text-black " />
              </span>
              <Image
                alt=""
                className=""
                src={URL.createObjectURL(post?.image)}
                width={250}
                height={250}
                quality={100}
              />
            </div>
          )}
        </div>
        {show && (
          <div className="w-full flex transition-all gap-x-3 mb-3 mt-2 relative items-center justify-between">
            <div className="flex items-center justify-evenly gap-x-4">
              <input
                type="file"
                onChange={(e) => handleChange(e)}
                id="image-picker"
                className="hidden"
              />
              <label htmlFor="image-picker">
                <ImageIcon className="opacity-70 text-lg" />
              </label>
              <Smile
                className="opacity-70 ml-2 text-lg"
                onClick={() => setEmoji(!emoji)}
              />
            </div>
            {emoji && (
              <div className="absolute z-10 top-16">
                <EmojiPicker
                  theme={Theme?.AUTO}
                  open={emoji}
                  className="scrollbar-none"
                  onEmojiClick={({ emoji }) =>
                    setPost({ ...post, caption: post?.caption.concat(emoji) })
                  }
                />
              </div>
            )}
            <div className="flex items-center justify-between gap-x-3">
              <button className="px-3 py-1 rounded-lg border dark:border-line">
                Cancel
              </button>
              <button
                onClick={() =>
                  post?.caption === ""
                    ? toast.error("Caption cannot be null")
                    : handleSubmit()
                }
                className="px-3 py-1 rounded-lg font-medium bg-white text-black"
              >
                {isPending ? <Loader2 className="animate-spin" /> : <>Post</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostForm;
