import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

async function GET(req: Request, { params }: { params: { id: string[] } }) {
  console.log({ params });
  const comment = await prisma.comment.findMany({
    where: {
      postId: params?.id[0] as string,
    },
    include: {
      Post: true,
      User: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  if (!comment) {
    return Response.json(
      { error: "An Error occured while fetching comments" },
      { status: 400 }
    );
  }
  return Response.json({ comment }, { status: 200 });
}
async function POST(req: Request, { params }: { params: { id: string[] } }) {
  const { caption }: { caption: string } = await req.json();
  const comment = await prisma.comment.create({
    data: {
      userId: cookies().get("user")?.value as string,
      postId: params?.id[0] as string,
      content: caption,
    },
  });
  if (!comment) {
    return Response.json({ error: "An Error occured " }, { status: 400 });
  }
  return Response.json({ comment }, { status: 200 });
}

export { GET, POST };
