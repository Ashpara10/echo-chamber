"use client";
import useUser from "@/lib/useUser";
import { deleteCookie, getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { User } from "@prisma/client";
import EditProfile from "./edit-profile";
import { useQuery } from "@tanstack/react-query";
import { getPostsByID } from "@/lib/actions";

const isImage = (exe: string) => {
  const imageExe = ["jpg", "jpeg", "png"];
  const isImg = imageExe.some((v) => v === exe);
  return isImg;
};

const Profile = () => {
  const id = getCookie("user");
  const router = useRouter();

  const { user, isLoading } = useUser({ id: id as string });
  const [updatedUser, setUpdatedUser] = useState<
    Pick<User, "username" | "name" | "image">
  >({
    username: user?.username as string,
    name: user?.name as string,
    image: user?.image as string,
  });

  const { data: posts, isLoading: loading } = useQuery({
    queryKey: ["post-by-id", id],
    queryFn: async () => getPostsByID(id as string),
  });

  return (
    <div className="w-full flex flex-col ">
      <div className="w-full gap-y-3 3 py-3 flex items-center justify-center ">
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
          <div className="flex mt-2 items-center justify-center gap-x-2">
            {user && (
              <EditProfile
                data={{
                  username: user?.username as string,
                  image: user?.image as string,
                  name: user?.name as string,
                }}
              />
            )}
            <button
              onClick={() => {
                // toast.loading("logging out");

                deleteCookie("user");
                deleteCookie("token");

                router.refresh();
              }}
              className="mt-1 px-4 py-1.5 rounded-2xl border hover:border-red-900 hover:text-white/90 hover:bg-red-500 dark:border-line"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="border-t dark:border-line w-full pb-10">
        <div className="masonry sm:masonry-sm md:masonry-md w-full mt-6 px-3 ">
          {loading ? (
            [...Array(9)].map((_, i) => {
              return (
                <div
                  key={i}
                  className=" dark:bg-line aspect-square  rounded-xl animate-pulse"
                />
              );
            })
          ) : user?.Post?.length === 0 ? (
            <div>No Posts</div>
          ) : (
            posts?.map((data, i) => {
              const type = data.Image && data?.Image?.split(".");
              const exe = type?.[type?.length - 1];
              return (
                <div
                  key={i}
                  onClick={() => router.push(`/home/post/${data?.id}`)}
                  className="flex items-center relative justify-center group min-h-[200px]"
                >
                  {data?.Image ? (
                    isImage(exe as string) ? (
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
                      <video
                        width={600}
                        height={600}
                        autoPlay={true}
                        controls={true}
                        className="aspect-square w-full rounded-3xl border  dark:border-line"
                      >
                        <source src={data?.Image} />
                      </video>
                    )
                  ) : (
                    <div className="border flex items-center justify-center dark:border-line rounded-3xl  py-4 ">
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

export default Profile;
