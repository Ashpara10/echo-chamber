import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

async function GET(req: Request) {
  const posts = await prisma?.post?.findMany({
    include: {
      User: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!posts) {
    return Response.json({
      error: "Posts not found",
      data: null,
    });
  }
  return Response.json({ data: posts, error: null });
}

async function POST(req: Request) {
  const { caption, Image }: { caption: string; Image: string } =
    await req.json();
  const post = await prisma?.post.create({
    data: {
      userId: cookies().get("user")?.value as string,
      caption: caption,
      Image: Image,
    },
  });
  console.log({ post });
  return Response.json({ data: post });
}

async function DELETE(req: Request) {
  const { post }: { post: string } = await req.json();
  const del = await prisma?.post.delete({
    where: {
      userId: cookies().get("user")?.value as string,
      id: post,
    },
  });
  if (!del) {
    return Response.json({ status: false }, { status: 404 });
  }
  console.log({ del });
  return Response.json({ status: true }, { status: 200 });
}

export { GET, POST, DELETE };
