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
        <div className="border-r w-fit  hidden items-center justify-end dark:border-line md:flex lg:max-w-sm h-screen">
          <Sidebar />
        </div>
        <div className="w-full flex-1 relative h-screen  overflow-y-scroll scrollbar-none">
          <Header />
          {children}
          <Mobilebar />
        </div>
        <div className="border-l px-3 items-start justify-center dark:border-line hidden lg:max-w-xs lg:flex w-full h-screen">
          <Suggestions />
        </div>
      </BookmarkProvider>
    </div>
  );
};

export default Layout;
