"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@prisma/client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2, Plus } from "lucide-react";
import { updateUser } from "@/lib/actions";
import { useMutation } from "@tanstack/react-query";
import url from "@/lib/url";
import toast, { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/query-client";

const schema = yup
  .object()
  .shape({
    username: yup.string().required().min(6),
    name: yup.string().required().min(4),
  })
  .required();

const EditProfile = ({
  data,
}: {
  data: Pick<User, "username" | "name" | "image">;
}) => {
  const [picture, setPicture] = useState<File | null>();
  const { mutate, isPending } = useMutation({
    mutationFn: async (user: Pick<User, "username" | "name">) => {
      const resp = await fetch(`${url}/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user?.username,
          name: user?.name,
        }),
      });
      return resp.json();
    },
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      username: "",
      name: "",
    },
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    setValue("name", data?.name as string);
    setValue("username", data?.username as string);
  }, [data]);

  return (
    <Dialog>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "dark:bg-dark border dark:border-line dark:text-white",
        }}
      />
      <DialogTrigger className="mt-1 hover:bg-line px-4 py-1.5 rounded-2xl border dark:border-line">
        Edit Profile
      </DialogTrigger>
      <DialogContent className="max-w-sm dark:bg-dark border dark:border-line rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently update your
            public user profile
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-fit">
          <div className="w-full flex items-center justify-center">
            {!picture ? (
              <Image
                className="aspect-square rounded-3xl"
                src={data?.image as string}
                width={120}
                height={120}
                alt={` pfp`}
              />
            ) : (
              <Image
                className="aspect-square rounded-3xl"
                src={URL.createObjectURL(picture)}
                width={120}
                height={120}
                alt={` pfp`}
              />
            )}
          </div>
          <label
            htmlFor="profile"
            className="absolute bottom-0 right-0 rounded-full bg-white text-black w-fit"
          >
            <Plus className="p-0.5" />
          </label>
        </div>
        <input
          type="file"
          onChange={(e) => setPicture(e.target.files && e.target.files[0])}
          id="profile"
          className="hidden"
        />
        <input
          id="name"
          placeholder="name"
          {...register("name")}
          className="w-full px-4 py-2 rounded-lg border dark:border-line"
        />
        {errors && (
          <span className="text-red-500 mt-0 px-2">
            {errors?.name?.message}
          </span>
        )}

        <input
          id="username"
          placeholder="username"
          {...register("username")}
          className="w-full px-4 py-2 rounded-lg border dark:border-line"
        />
        {errors && (
          <span className="text-red-500 mt-0 px-2">
            {errors?.username?.message}
          </span>
        )}
        <button
          onClick={handleSubmit(async (val) => {
            mutate(val, {
              onSuccess: async (data) => {
                await queryClient.refetchQueries({ queryKey: ["get-user"] });
                toast.success("user updated");
              },
              onError: (err) => {
                toast.error(`${err?.message}`);
              },
            });
          })}
          className="flex items-center justify-center w-full bg-white font-medium px-4 py-2 rounded-lg text-black"
        >
          {isPending ? <Loader2 className="animate-spin" /> : <>Update User</>}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
