import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
  const body = await req.json();
  console.log({ body, id: cookies().get("user")?.value });
  const newUser = await prisma.user.update({
    where: {
      id: cookies().get("user")?.value as string,
    },
    data: {
      username: body?.username,
      name: body?.name,
    },
  });
  if (!newUser) {
    return Response.json(
      { error: "update failed", data: null },
      { status: 404 }
    );
  }
  return Response.json({ error: null, data: newUser }, { status: 200 });
}
export async function DELETE(req: Request) {}
