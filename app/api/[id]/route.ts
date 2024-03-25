import prisma from "@/lib/prisma";

async function GET(request: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: {
      id: params?.id as string,
    },
    include: {
      User: true,
      Comment: true,
    },
  });
  if (!post) {
    return Response.json(
      { error: "An unexpected error occured" },
      { status: 400 }
    );
  }
  return Response.json({ post }, { status: 200 });
}
export { GET };
