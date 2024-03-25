import prisma from "@/lib/prisma";

async function GET(req: Request, { params }: { params: { user: string } }) {
  const posts = await prisma?.post?.findMany({
    include: {
      User: true,
    },
    where: {
      userId: params?.user as string,
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
export { GET };
