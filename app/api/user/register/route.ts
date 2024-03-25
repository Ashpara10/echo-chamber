import { sign } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const {
      username,
      email,
      password,
      image,
    }: { username: string; email: string; password: string; image: string } =
      await req.json();

    const userExists = await prisma?.user?.findUnique({
      where: {
        username: username,
        email: email,
      },
    });
    if (userExists) {
      return Response.json(
        {
          data: null,
          error: `User with following username or email already exists`,
        },
        { status: 409 }
      );
    }

    const user = await prisma?.user?.create({
      data: {
        username: username,
        email: email,
        password: password,
        image: image,
      },
    });
    console.log({ user });

    const token = sign(user, process?.env?.JWT_SECRET as string);
    cookies().set("user", user?.id);
    cookies().set("token", token);
    return Response.json(
      { data: { user, token }, error: null },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ err });
  }
}
