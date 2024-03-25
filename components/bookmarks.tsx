"use client";

import React, { createContext, useEffect, useState, ReactNode } from "react";

export const BookmarkContext = createContext<{} | null>(null);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  useEffect(() => {
    const data = localStorage.getItem("bookmarks");
    if (data?.length === 0) return;
    setBookmarks(JSON.parse(data as string) as string[]);
    console.log({ data: JSON.parse(data as string) });
  }, []);
  useEffect(() => {
    console.log({ bookmarks });
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = (id: string) => {
    return bookmarks.find((e, i) => e === id);
  };
  const addBookmark = (id: string) => {
    if (isBookmarked(id)) return;
    setBookmarks([...bookmarks, id]);
  };
  const removeBookmark = (id: string) => {
    if (bookmarks.length < 1) return;
    const index = bookmarks.indexOf(id);
    if (index > -1) {
      bookmarks.splice(index, 1);
      setBookmarks(bookmarks);
    }
    return bookmarks;
  };
  return (
    <BookmarkContext.Provider
      value={{
        bookmarks: bookmarks,
        addBookmark: addBookmark,
        setBookmarks: setBookmarks,
        isBookmarked: isBookmarked,
        removeBookmark: removeBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
