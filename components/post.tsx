import { Post, User } from "@prisma/client";
import { Dot, MoreHorizontal, Reply, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import moment from "moment";
import { getCookie } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useInView } from "framer-motion";
import { deletePost } from "@/lib/actions";
import HHeart from "@/icons/heart";
import HBookmark from "@/icons/bookmark";
import HMessage from "@/icons/message";
import HTrash from "@/icons/trash";
import toast from "react-hot-toast";
import { queryClient } from "@/lib/query-client";

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
  const router = useRouter();
  const user = getCookie("user");
  const type = data.Image && data?.Image?.split(".");
  const exe = type?.[type?.length - 1];
  const ref = useRef<HTMLVideoElement | null>(null);

  const inView = useInView(ref, { amount: 0.5, margin: "0px" });
  useEffect(() => {
    if (inView) {
      ref?.current?.play();
    }
  }, [inView]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => deletePost(id as string),
  });

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
            ref={ref}
            width={600}
            height={600}
            loop={true}
            style={{ objectFit: "cover" }}
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
      <div className="mt-3 border-t-2 dark:border-line pb-4  pt-3 w-full flex items-center justify-evenly">
        <HMessage className="size-5 opacity-80" />
        <HHeart className="size-5 opacity-80" />
        <HBookmark className="size-5 opacity-80" />
        {user === data?.User?.id && (
          <HTrash
            onClick={async () => {
              mutate(data?.id, {
                onSuccess: async () => {
                  await toast.success("post deleted");
                  queryClient.refetchQueries({ queryKey: ["posts"] });
                },
                onError(error) {
                  toast.error(error?.message);
                },
              });
            }}
            className="size-5 opacity-80 hover:text-red-500"
          />
        )}
      </div>
    </article>
  );
};

export default PostCard;
