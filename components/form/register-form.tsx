"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowRight, Eye, EyeIcon, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import url from "@/lib/url";
import { useMutation } from "@tanstack/react-query";
import { User } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

const DEFAULT_USER_PROFILE =
  "https://i.pinimg.com/564x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg";

const schema = yup
  .object()
  .shape({
    image: yup.string().required(),
    name: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
  })
  .required();

const Form = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(schema) });
  const [show, setShow] = useState(false);

  const router = useRouter();
  const [file, setFile] = useState<File | null>();
  const { isPending, mutate, data } = useMutation({
    mutationFn: async (
      val: Pick<User, "name" | "username" | "email" | "password">
    ) => {
      const resp = await fetch(`${url}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...val, image: DEFAULT_USER_PROFILE }),
      });
      const res = await resp.json();
      return res;
    },
  });
  return (
    <form
      onSubmit={handleSubmit(async (user) => {
        mutate(user, {
          onSuccess: (u) => {
            console.log({ u });
            toast.success("registered successfully");
            router.push("/home");
          },
          onError: (err) => {
            console.log({ err });
            toast.error(err?.message);
          },
        });
      })}
      className="max-w-sm w-full flex flex-col items-center justify-center"
    >
      <div className="w-full flex flex-col items-start justify-start gap-3 ">
        <div className="flex flex-col items-start justify-center w-full gap-1 mb-2">
          <span className="text-2xl font-semibold md:text-3xl">
            Signup to echo
          </span>
          <span className="flex mx-1 items-center justify-center gap-1">
            <span className="opacity-80">Already have an account?</span>
            <Link
              href={"/account/login"}
              className="flex items-center justify-center gap-1 text-green-300 text-opacity-100  hover:underline underline-offset-4"
            >
              Login <ArrowRight className="size-4" />
            </Link>
          </span>
        </div>

        <input
          placeholder="name"
          {...register("name")}
          className="form-input"
        />

        <input
          placeholder="username"
          {...register("username")}
          className="form-input"
        />

        <input
          placeholder="email"
          {...register("email")}
          type="email"
          className="form-input"
        />

        <div className="w-full mt-1 border overflow-hidden border-line rounded-lg bg-dark flex items-center justify-center ">
          <input
            placeholder="password"
            {...register("password")}
            type={show ? "text" : "password"}
            className="w-full px-4 py-2"
          />
          <button
            type="button"
            className="my-1 mx-2 opacity-80"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black font-medium py-2 px-4 mt-2">
          {isPending && <Loader2 className="animate-spin size-5" />} Sign up
        </button>
        <span className="text-sm space-1 opacity-90 mt-2 px-1">
          By signing in, you agree to the{" "}
          <u className="underline-offset-2">Terms of Service</u> <br /> and{" "}
          <u className="underline-offset-2">Privacy Policy</u>.
        </span>
      </div>
      <span className="text-red-600">
        {errors && errors?.password?.message}
      </span>
      <span className="text-red-600">{errors && errors?.email?.message}</span>
      <span className="text-red-600">
        {errors && errors?.username?.message}
      </span>
    </form>
  );
};

export default Form;
