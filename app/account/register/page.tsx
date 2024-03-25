"use client";
import Form from "@/components/form/register-form";
import Link from "next/link";

const Page = () => {
  return (
    <div className="w-full px-4 h-screen flex flex-col items-center justify-center">
      <Form />
      <span className=" mt-4">
        Already have an account?
        <Link
          href={"/account/login"}
          className=" hover:underline opacity-100 text-blue-700"
        >
          Login
        </Link>
      </span>
    </div>
  );
};

export default Page;
