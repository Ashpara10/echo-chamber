import { Comment, Post, User } from "@prisma/client";
import prisma from "@/lib/prisma";
import url from "./url";
import supabase from "./supabase";
import { getCookie } from "cookies-next";

export type TUser = Pick<User, "username" | "password" | "email">;
const user = getCookie("user");

export async function deletePost(id: string) {
  const resp = await fetch(`${url}/api/posts`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post: id,
    }),
  });
  const res = await resp?.json();
  return res;
}

export const upload = async ({ media }: { media: File }) => {
  const filename = media?.name.split(" ").join("");
  console.log({ filename });
  const { data, error } = await supabase.storage
    .from("images")
    .upload(`${user}/${filename}`, media);
  if (error) {
    return { data, error };
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(data?.path as string);
  return { data: publicUrl, error: null };
};

export const makePost = async ({
  post,
}: {
  post: Pick<Post, "Image" | "caption">;
}) => {
  const res = await fetch(`${url}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      !post?.Image
        ? { caption: post?.caption }
        : {
            caption: post?.caption,
            Image: post?.Image,
          }
    ),
  });
  const data = await res.json();
  return data;
};

export const DEFAULT_USER_PROFILE =
  "https://i.pinimg.com/564x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg";
export async function createUser(user: TUser) {
  const newUser = await prisma?.user?.create({
    data: {
      username: user?.username,
      email: user?.email,
      password: user?.password,
      image: DEFAULT_USER_PROFILE,
    },
  });
  return newUser;
}

export async function checkUserByCredentials({
  username,
  email,
}: Pick<TUser, "username" | "email">) {
  const userExists = await prisma?.user?.findUnique({
    where: {
      username: username,
      email: email,
    },
  });
  if (userExists) {
    return {
      error: `User with following username or email already exists`,
    };
  }
  return { error: null };
}

// const updateProfileImage=async()=>{
//   supabase.storage.from("images").update()
// }

export const updateUser = async ({
  user,
}: {
  user: Pick<User, "username" | "name">;
}) => {
  const newUser = await prisma.user.update({
    where: {
      username: user?.username as string,
    },
    data: {
      username: user?.username,
      // image: user?.image,
      name: user?.name,
    },
  });
  return newUser;
};

interface PostProps extends Post {
  User: User;
}
export const bookmarkPost = async ({
  post,
  name,
}: {
  post: PostProps;
  name: string;
}) => {
  const res = await fetch(`${url}/api/bookmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post: post,
      name: name,
    }),
  });
  const resp = await res.json();
  return { data: resp };
};

export interface IPost extends Post {
  User: User;
}
export interface IUser extends User {
  Post: IPost[];
}

export interface TComment extends Comment {
  Post: Post;
  User: User;
}

export const getPosts = async () => {
  const res = await fetch(`${url}/api/posts`);
  const data = await res?.json();
  return data?.data as IPost[];
};

export const getPostsByID = async (id: string) => {
  const res = await fetch(`${url}/api/posts/${id}`);
  const data = await res?.json();
  return data?.data as IPost[];
};

export async function getUserByToken() {
  const res = await fetch(`${url}/api/user/token`);
  const resp = await res?.json();
  if (res.status !== 200) {
    console.log({ resp });
    throw new Error(resp);
  }
  console.log({ resp });
  return { user: resp?.user };
}
