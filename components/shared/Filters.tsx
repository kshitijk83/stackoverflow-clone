"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery2 } from "@/lib/utils";

interface Props {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
  placeholder: string;
}

const Filters = ({
  filters,
  otherClasses,
  containerClasses,
  placeholder,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filter = searchParams.get("filter");
  function handleUpdateValue(value) {
    const url = formUrlQuery2({
      key: "filter",
      value,
      params: searchParams.toString(),
      path: pathname,
    });
    router.push(url, { scroll: false });
  }

  return (
    <div className={`relative ${containerClasses}`}>
      <Select onValueChange={handleUpdateValue} value={filter || undefined}>
        <SelectTrigger
          className={`${otherClasses}
        body-regular light-border background-light800_dark300
        text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
