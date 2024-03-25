import prisma from "@/lib/prisma";
import { sign } from "jsonwebtoken";

type LoginResp = {
  data: { [name: string]: string } | null;
  error: string | null;
};

export async function POST(req: Request) {
  const { username, password }: { username: string; password: string } =
    await req.json();

  const user = await prisma?.user?.findUnique({
    where: {
      username: username,
    },
  });
  console.log(user);
  if (!user) {
    return Response.json({
      data: null,
      error: `ERROR: User "${username}" does not exists`,
    });
  } else if (user?.password !== password) {
    return Response.json({
      data: null,
      error: `ERROR: Login with the correct password`,
    });
  }
  const token = sign(user, process?.env?.JWT_SECRET as string);

  return Response.json({ data: { user: user?.id, token: token }, error: null });
}
