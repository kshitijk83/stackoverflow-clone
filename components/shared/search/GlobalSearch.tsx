"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery2, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const searchConRef = useRef(null);

  const query = searchParams.get("global");

  const [search, setSearch] = useState(query || "");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        searchConRef.current &&
        !searchConRef.current.contains(event.target)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    setOpen(false);

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [pathName]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery2({
          params: searchParams.toString(),
          key: "global",
          value: search,
          path: pathName,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const url = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["global", "type"],
            path: pathName,
          });
          router.push(url, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, router, pathName, searchParams, query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchConRef}
    >
      <div
        className="background-light800_darkgradient relative
flex min-h-[56px] grow items-center gap-1 rounded-xl px-4"
      >
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search Globally"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            if (e.target.value === "" && open) {
              setOpen(false);
            }
            if (!open) {
              setOpen(true);
            }
          }}
          className="paragraph-regular no-focus text-dark400_light700
        placeholder background-light800_darkgradient border-none
        shadow-none outline-none"
        />
      </div>
      {open && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
