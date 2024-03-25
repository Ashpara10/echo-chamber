import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient, User } from "@prisma/client";
import { cookies } from "next/headers";
import url from "./url";

const prisma = new PrismaClient();
export const auth: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${url}/api/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });
        const data = await res.json();

        if (data?.error) {
          return null;
        }
        console.log({ data });
        cookies().set("user", data?.data?.user);
        cookies().set("token", data?.data?.token);
        return data?.data?.user as User;
      },
    }),
  ],
};
