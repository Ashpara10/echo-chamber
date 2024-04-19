"use client";
import { Image2Icon } from "@/icons/image";
import { makePost, upload } from "@/lib/actions";
import { queryClient } from "@/lib/query-client";
import useUser from "@/lib/useUser";
import { Post } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

const PostForm = () => {
  const id = getCookie("user");
  const [show, setShow] = useState(false);
  const [type, setType] = useState<"image" | "video" | null>(null);
  const { user, error, isLoading } = useUser({ id: id as string });
  const [src, setSrc] = useState<string | null>(null);

  const [post, setPost] = useState<{ caption: string; image?: File | null }>({
    caption: "",
    image: null,
  });
  useEffect(() => {
    if (post?.image) {
      const t = post?.image?.type?.split("/")[0];
      setSrc(window?.URL.createObjectURL(post?.image as File) as string);
      if (t === "image") {
        setType("image");
      } else {
        setType("video");
      }
    }
  }, [post?.image]);
  const { mutate, isPending } = useMutation({
    mutationFn: (post: Pick<Post, "Image" | "caption">) => makePost({ post }),
  });
  const handleSubmit = async () => {
    const { data, error } = await upload({ media: post?.image as File });
    if (error) {
      toast.error(error?.message);
      return;
    }

    mutate(
      { caption: post?.caption, Image: post?.image ? data : null },
      {
        onError: (err) => toast.error(err?.message),
        onSuccess: async () => {
          setPost({ caption: "", image: null });
          toast.success("Successfully posted");
          await queryClient.refetchQueries({ queryKey: ["posts"] });
        },
      }
    );
  };

  return (
    <div className="w-full pb-2 group flex justify-center items-start px-3 border-b dark:border-line mt-8">
      <div className="w-full group flex flex-col px-4  items-center justify-center">
        <TextareaAutosize
          value={post?.caption}
          onClick={() => setShow(true)}
          onChange={(e) =>
            setPost({ ...post, caption: e?.target?.value as string })
          }
          placeholder="What's on your mind...."
          minRows={2}
          className="w-full bg-transparent appearance-none resize-none focus-visible:outline-none"
        />
        {src && (
          <div className="flex w-full items-center justify-start">
            <div className="rounded-2xl  relative overflow-hidden border dark:border-line">
              <span
                onClick={() => {
                  setPost({ ...post, image: null }),
                    setSrc(null),
                    setType(null);
                }}
                className="absolute top-3 left-3 rounded-full p-0.5  bg-white"
              >
                <X className="text-black " />
              </span>
              {type === "image" ? (
                <Image
                  alt=""
                  className=" aspect-square"
                  src={src}
                  width={500}
                  height={500}
                  quality={100}
                />
              ) : (
                <video
                  className="max-w-md aspect-square"
                  width={250}
                  height={250}
                  autoPlay={true}
                  controls={true}
                >
                  <source src={src} />
                </video>
              )}
            </div>
          </div>
        )}
        <AnimatePresence>
          {show && (
            <motion.div
              transition={{ duration: 0.25, type: "tween", ease: "easeIn" }}
              className="overflow-hidden w-full flex transition-all gap-x-3 mb-3 mt-3 px-2 relative items-center justify-between"
            >
              <div className="flex items-center justify-evenly gap-x-4">
                <input
                  type="file"
                  onChange={(e) =>
                    e?.target?.files &&
                    setPost({ ...post, image: e.target.files[0] })
                  }
                  id="image-picker"
                  className="hidden"
                />
                <label htmlFor="image-picker">
                  <Image2Icon className="size-7 opacity-70" />
                </label>
              </div>

              <div className="flex items-center justify-between gap-x-3">
                <button
                  onClick={() => {
                    setShow(false);
                    setPost({ caption: "", image: null });
                    setSrc(null);
                  }}
                  className="px-3 py-1 hover:underline opacity-80 underline-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    post?.caption === ""
                      ? toast.error("Caption cannot be null")
                      : handleSubmit()
                  }
                  className="px-4 py-1.5 flex items-center justify-center gap-1 rounded-xl font-medium bg-white text-black"
                >
                  {isPending && <Loader2 className="animate-spin size-5" />}
                  Publish
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostForm;
