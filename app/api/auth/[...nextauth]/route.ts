import { auth } from "@/lib/auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(auth);

export { handler as POST, handler as GET };
