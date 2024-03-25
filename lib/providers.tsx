"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import React from "react";
import QueryProvider from "./query-client";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <SessionProvider>
        <ThemeProvider defaultTheme="dark" attribute="class">
          {children}
        </ThemeProvider>
      </SessionProvider>
    </QueryProvider>
  );
};

export default Providers;
