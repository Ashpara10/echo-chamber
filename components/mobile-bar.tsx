"use client";
import {
  Bell,
  Bookmark,
  Home,
  MessageCircle,
  Search,
  User2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import SearchModal from "./search";

const Mobilebar = () => {
  const router = useRouter();
  const [searchModal, setSearchModal] = useState(false);

  const items = [
    {
      name: "Home",
      icon: <Home className=" opacity-70 size-6" />,
      href: "/home",
    },
    {
      name: `Search`,
      icon: (
        <Search
          onClick={() => setSearchModal(!searchModal)}
          className=" opacity-70 size-6"
        />
      ),
      href: "",
    },
    {
      name: "Notifications",
      icon: <Bell className=" opacity-70 size-6" />,
      href: "",
    },

    {
      name: "Bookmarks",
      icon: <Bookmark className=" opacity-70 size-6" />,
      href: "/home/bookmarks",
    },
    {
      name: "Profile",
      icon: <User2 className="opacity-70 size-6" />,
      href: "/home/profile",
    },
  ];
  return (
    <>
      <SearchModal open={searchModal} setOpen={setSearchModal} />
      <nav className="w-full h-fit dark:bg-dark/85 backdrop-blur-lg  border-t dark:border-line fixed z-10 bottom-0 flex items-center justify-center px-3 py-2.5 md:hidden">
        <ul className="w-full flex items-center justify-evenly gap-x-2 my-2">
          {items?.map((e, i) => {
            return (
              <li
                key={i}
                onClick={() => router.push(e?.href)}
                className=" mx-2"
              >
                {e?.icon}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Mobilebar;
