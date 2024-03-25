import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { "user-id": string } }
) {
  const userId = params["user-id"];
  if (!userId) {
    throw new Error("Provide a valid User ID");
  }
  const user = await prisma?.user?.findUnique({
    where: {
      id: (typeof userId !== "undefined" && userId) as string,
    },
  });
  if (!user) {
    return Response.json(
      {
        error: `User with ${userId} not found`,
        data: null,
      },
      { status: 404 }
    );
  }
  return Response.json({ data: user, error: null });
}
