"use client";

import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery2 } from "@/lib/utils";

const HomeFilters = () => {
  const searchParams = useSearchParams();

  const [active, setActive] = useState(searchParams.get("filter") || "");

  const router = useRouter();
  const pathName = usePathname();

  const handleTypeClick = (value: string) => {
    if (value === active) {
      setActive("");
      const newUrl = formUrlQuery2({
        params: searchParams.toString(),
        key: "filter",
        value: null,
        path: pathName,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(value);
      const url = formUrlQuery2({
        params: searchParams.toString(),
        key: "filter",
        value,
        path: pathName,
      });
      router.push(url, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.value}
          onClick={() => handleTypeClick(filter.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none
          ${
            active === filter.value
              ? "bg-primary-100 text-primary-500"
              : "bg-light-800 text-light-500"
          }
          `}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
