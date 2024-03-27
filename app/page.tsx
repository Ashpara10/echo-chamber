"use client";
import HeroSection from "@/components/landing/hero-section";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 mt-10">
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
