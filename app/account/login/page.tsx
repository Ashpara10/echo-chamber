import Form from "@/components/form/login-form";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="w-full px-4 h-screen flex flex-col items-center justify-center">
      <Form />
      <span className="mt-5">
        Don't have an account yet?
        <Link
          href={"/account/register"}
          className=" hover:underline text-blue-700"
        >
          Register
        </Link>
      </span>
    </div>
  );
};

export default Page;
