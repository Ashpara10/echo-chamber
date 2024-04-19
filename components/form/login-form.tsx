"use client";
import { User } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowRight, Eye, EyeOff, Loader, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import url from "@/lib/url";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

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
      <div className="w-full flex flex-col items-start justify-start gap-3">
        <div className="flex flex-col items-start justify-center w-full gap-1 mb-2">
          <span className="text-2xl font-semibold md:text-3xl">
            SignIn to echo
          </span>
          <span className="flex mx-1 items-center justify-center gap-1">
            <span className="opacity-80">Don't have an account?</span>
            <Link
              href={"/account/register"}
              className="flex items-center justify-center gap-1 text-green-300 text-opacity-100  hover:underline underline-offset-4"
            >
              create one <ArrowRight className="size-4" />
            </Link>
          </span>
        </div>

        <input
          placeholder="username"
          {...register("username")}
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
          {isLoading && <Loader className="animate-spin size-5" />} Sign In
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
      <span className="text-red-600">
        {errors && errors?.username?.message}
      </span>
    </form>
  );
};

export default Form;
