"use client";
import {
  Bell,
  Bookmark,
  Home,
  MessageCircle,
  Search,
  User2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Sidebar = () => {
  const router = useRouter();
  const items = [
    { name: "Home", icon: <Home className="opacity-70" />, href: "/home" },
    { name: `Search`, icon: <Search className="opacity-70" />, href: "" },
    { name: "Notifications", icon: <Bell className="opacity-70" />, href: "" },
    { name: "Inbox", icon: <MessageCircle className="opacity-70" />, href: "" },
    {
      name: "Bookmarks",
      icon: <Bookmark className="opacity-70" />,
      href: "/home/bookmarks",
    },
    {
      name: "Profile",
      icon: <User2 className="opacity-70" />,
      href: "/home/profile",
    },
  ];

  return (
    <aside className="h-screen flex p-3.5  flex-col items-center justify-start">
      <nav className="flex flex-col  gap-y-4 items-center justify-start ">
        <div>
          <Image src={"/logo.png"} width={40} height={40} alt="" />
        </div>
        <ul className="flex flex-col  gap-y-4 items-center justify-start ">
          {items?.map((e, i) => {
            return (
              <li
                key={i}
                onClick={() => router?.push(e?.href)}
                className="group   my-2"
              >
                {e?.icon}
                <span className="hidden absolute z-30 translate-x-14 -translate-y-6 text-sm group-hover:flex  items-center justify-center dark:bg-black text-white text-opacity-80 px-2 py-1 rounded-lg ">
                  {e?.name}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
