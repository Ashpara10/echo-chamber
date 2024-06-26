"use client";
import HeroSection from "@/components/landing/hero-section";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 mt-16">
      <div className="fixed inset-0 -z-50 h-full w-full bg-transparent opacity-20 dark:opacity-10 bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]  bg-[size:2rem_2rem] md:bg-[size:6rem_4rem]"></div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3,
          className: "dark:bg-dark border dark:border-line dark:text-white/90",
        }}
      />
      <HeroSection />
    </main>
  );
}
