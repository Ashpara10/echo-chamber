"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import url from "@/lib/url";
import { useMutation } from "@tanstack/react-query";
import { User } from "@prisma/client";

const DEFAULT_USER_PROFILE =
  "https://i.pinimg.com/564x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg";

const schema = yup
  .object()
  .shape({
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
    getValues,
  } = useForm({ resolver: yupResolver(schema) });
  const [show, setShow] = useState(false);

  const router = useRouter();
  const { isPending, mutate, data } = useMutation({
    mutationFn: async (val: Pick<User, "username" | "email" | "password">) => {
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
      <span className="tracking-tighter text-4xl mb-4 font-bold">
        Register Account
      </span>
      <input
        {...register("username")}
        placeholder="Enter Username"
        className="w-full  rounded-xl bg-transparent  px-4 py-2.5 border dark:border-line focus-visible:outline-none"
      />
      <input
        {...register("email")}
        type="email"
        placeholder="jhondoe@gmail.com"
        className="w-full  rounded-xl bg-transparent mt-3 px-4 py-2.5 border dark:border-line focus-visible:outline-none"
      />
      <div className="w-full mt-3 rounded-xl overflow-hidden flex   border dark:border-line">
        <input
          className="w-full bg-transparent  px-4 py-2.5  focus-visible:outline-none"
          type={show ? "text" : "password"}
          placeholder="Enter Password"
          {...register("password")}
        />
        <div
          onClick={() => setShow(!show)}
          className="text-lg flex items-center justify-center border-l dark:border-line px-2.5 "
        >
          {show ? <Eye /> : <EyeOff />}
        </div>
      </div>
      <button className="w-full flex items-center justify-center font-medium mt-3 rounded-xl bg-white text-black px-4 py-2">
        {isPending ? <Loader2 className="animate-spin" /> : <>Register</>}
      </button>
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
