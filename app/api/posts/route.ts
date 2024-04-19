import prisma from "@/lib/prisma";
import supabase from "@/lib/supabase";
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
  const postToDelete = await prisma.post.findUnique({
    where: {
      id: post,
    },
  });
  if (postToDelete) {
    const filename = postToDelete?.Image?.slice(
      postToDelete?.Image?.lastIndexOf("images"),
      postToDelete?.Image?.length
    );
    console.log(filename);
    const { data, error } = await supabase.storage
      .from("my-bucket")
      .remove([filename as string]);
    console.log({ data, error });
    if (error) {
      return Response.json({ status: false }, { status: 400 });
    }
  }

  const del = await prisma?.post.delete({
    where: {
      userId: cookies().get("user")?.value as string,
      id: post,
    },
  });
  if (!del) {
    return Response.json({ status: false }, { status: 404 });
  }

  return Response.json({ status: true }, { status: 200 });
}

export { GET, POST, DELETE };
