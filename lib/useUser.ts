"use client";
import url from "./url";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "./actions";

const useUser = ({ id }: { id: string }) => {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["get-user"],
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const res = await fetch(`${url}/api/user/${id}`);
      const data = await res?.json();
      return data;
    },
  });
  return { user: user?.data as IUser, isLoading, error };
};

export default useUser;
