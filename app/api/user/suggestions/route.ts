import { getCookie } from "cookies-next";
import prisma from "@/lib/prisma";
export async function GET(req: Request) {
  const suggestions = await prisma.user?.findMany({
    where: {
      id: {
        not: getCookie("user") as string,
      },
    },
    take: 5,
  });
  return Response.json({ data: suggestions });
}
