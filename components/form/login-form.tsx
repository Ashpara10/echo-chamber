"use client";
import { User } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import url from "@/lib/url";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

type TUser = Pick<User, "username" | "password">;

const schema = yup
  .object()
  .shape({
    username: yup.string().required(),
    password: yup.string().required().min(6),
  })
  .required();

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [show, setShow] = useState(false);
  const { push } = useRouter();
  return (
    <form
      onSubmit={handleSubmit(async (d) => {
        setIsLoading(true);
        const res = signIn("credentials", {
          username: d?.username,
          password: d?.password,
          redirect: false,
        }).then((resp) => {
          setIsLoading(false);
          if (resp?.ok) {
            toast.success("user loggedin");
            push("/home");
          } else {
            console.log(resp?.error);
            toast.error("Credentials do not match");
          }
        });
      })}
      className="max-w-sm w-full flex flex-col items-center justify-center"
    >
      <Toaster
        position="top-center"
        toastOptions={{
          className: "dark:bg-line dark:text-white",
        }}
      />
      <span className="tracking-tighter text-4xl mb-4 font-bold">SignIn</span>
      <input
        {...register("username")}
        placeholder="Enter Username"
        className="w-full  rounded-xl bg-transparent  px-4 py-2.5 border dark:border-line focus-visible:outline-none"
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
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>SignIn with Username</>
        )}
      </button>
      <span className="text-red-600">
        {errors && errors?.password?.message}
      </span>
      <span className="text-red-600">
        {errors && errors?.username?.message}
      </span>
    </form>
  );
};

export default Form;
