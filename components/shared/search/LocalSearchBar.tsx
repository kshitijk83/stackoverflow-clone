"use client";
import { Input } from "@/components/ui/input";
import { formUrlQuery, formUrlQuery2, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

interface CustomInputProps {
  route: string;
  iconPosition: "left" | "right";
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchBar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = React.useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery2({
          params: searchParams.toString(),
          key: "q",
          value: search,
          path: pathName,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathName === route) {
          const url = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["q"],
            path: pathName,
          });
          router.push(url, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathName, router, searchParams, query]);

  return (
    <div className="relative w-full">
      <div
        className={`background-light800_darkgradient relative
        flex min-h-[56px] grow items-center gap-1 rounded-[10px] px-4 ${otherClasses}`}
      >
        {iconPosition === "left" && (
          <Image
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
        <Input
          type="text"
          placeholder={placeholder}
          className="paragraph-regular no-focus 
    placeholder background-light800_darkgradient text-dark100_light900
    border-none shadow-none outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {iconPosition === "right" && (
          <Image
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default LocalSearchBar;
