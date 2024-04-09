import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./ui/dialog";
import { IPost, IUser, getPosts } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import Fuse, { FuseResult } from "fuse.js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

const SearchModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const resp = await fetch(`/api/user`);
      const res = await resp.json();
      return res?.data as IUser[];
    },
  });
  const options = { keys: ["username", "name"] };
  const index = Fuse.createIndex(options.keys, data as IUser[]);
  const fuse = new Fuse(data as IUser[], options, index);

  useEffect(() => {
    if (search.length > 1) {
      const res = fuse?.search(search);
      console.log({ res });
      setTimeout(() => {
        setResults(res);
      }, 1000);
    }
  }, [search]);
  const user = getCookie("user");

  return (
    <Dialog open={open}>
      <DialogOverlay onClick={() => setOpen(false)} />
      <DialogContent className="border-xl max-w-md border border-line dark:bg-dark flex flex-col w-full gap-2 items-center justify-center">
        <DialogHeader className="w-full">
          <DialogTitle className="w-full flex items-center justify-start gap-1  px-2 mb-1">
            Search for users
          </DialogTitle>
          <DialogDescription className="flex-wrap w-full text-left px-2 pb-4">
            Search for fellow users with their name and username
          </DialogDescription>
          <div className="flex items-center justify-center w-full px-4 py-2 mt-2 border border-line rounded-lg">
            <input
              className="w-full"
              value={search}
              placeholder="Search for users ..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="opacity-80 size-5" />
          </div>
          <div className="px-2 mt-2 w-full flex items-center justify-start">
            <span className="opacity-80">{results?.length} results found </span>
          </div>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-scroll scrollbar-none flex flex-col w-full gap-y-2 items-center justify-center pt-4 px-2 scroll-smooth ">
          {isLoading && <Loader2 className="animate-spin size-6" />}
          {results &&
            results.map((u, i: number) => {
              return (
                <div
                  key={i}
                  className="flex border-t border-line  gap-2 pt-2 items-center justify-center w-full "
                >
                  <Image
                    alt={"pfp"}
                    src={u?.item?.image as string}
                    width={45}
                    height={45}
                    className="aspect-square rounded-full"
                  />
                  <div className="ml-0.5 w-full flex flex-col  items-start justify-center ">
                    <span
                      className=""
                      onClick={() =>
                        u?.item?.id === user
                          ? router.push("/home/profile")
                          : router.push(`/home/profile/${u?.item?.id}`)
                      }
                    >
                      {u?.item?.name}
                    </span>
                    <span className=" opacity-80">@{u?.item?.username}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
