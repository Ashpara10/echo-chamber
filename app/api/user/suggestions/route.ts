import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const u = cookies().get("user")?.value;

  const suggestions = await prisma.user?.findMany({
    where: {
      id: {
        not: u,
      },
    },
    take: 5,
  });
  return Response.json({ data: suggestions });
}
