import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="w-full px-4 py-4 z-40 sticky top-0 border-b backdrop-blur-lg dark:border-line flex items-center justify-center dark:bg-dark/80  ">
      <div className="flex items-center justify-center gap-3">
        <span className="text-2xl font-semibold">echo</span>
      </div>
    </header>
  );
};

export default Header;
