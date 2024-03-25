import { BookmarkProvider } from "@/components/bookmarks";
import Header from "@/components/header";
import Mobilebar from "@/components/mobile-bar";
import Sidebar from "@/components/sidebar";
import Suggestions from "@/components/suggestions";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex ">
      <BookmarkProvider>
        <div className="border-r w-fit  hidden items-center justify-end dark:border-line md:flex lg:max-w-md lg:w-full h-screen">
          <Sidebar />
        </div>
        <div className="w-full relative h-screen  overflow-y-scroll scrollbar-none">
          <Header />
          {children}
          <Mobilebar />
        </div>
        <div className="border-l px-3 items-start justify-center dark:border-line hidden md:flex md:max-w-xs lg:max-w-md w-full h-screen">
          {/* <div className="mt-10"> */}
          <Suggestions />
          {/* </div> */}
        </div>
      </BookmarkProvider>
    </div>
  );
};

export default Layout;
