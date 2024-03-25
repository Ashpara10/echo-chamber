import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="w-full px-4 py-4 z-40 sticky top-0 border-b dark:border-line flex items-center justify-center dark:bg-dark  ">
      <span className="text-3xl font-bold tracking-tighter">echo</span>
    </header>
  );
};

export default Header;
