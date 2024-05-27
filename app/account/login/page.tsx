import Form from "@/components/form/login-form";
import React from "react";
import { Toaster } from "react-hot-toast";

const Page = () => {
  return (
    <div className="w-full px-4 h-screen flex flex-col items-center justify-center">
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "dark:bg-dark border-2 dark:border-line/50 dark:text-white opacity-80",
        }}
      />
      <Form />
    </div>
  );
};

export default Page;
