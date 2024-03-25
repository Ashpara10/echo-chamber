import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";

// add prisma to the NodeJS global types to
// prevent multiple instances of prisma client
// get created by hot-reloading in development
declare global {
  var prisma: PrismaClient;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}
export const updateUserImage = async (url: string) => {
  const userId = getCookie("user");
  console.log({ userId });
  const userUpdate = await prisma?.user?.update({
    data: {
      image: url,
    },
    where: {
      id: userId as string,
    },
  });
  return userUpdate;
};

export default prisma;
