import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery2 } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");

  const [activeType, setActiveType] = useState(typeParams || "");

  const handleTypeClick = (value: string) => {
    if (value === activeType) {
      setActiveType("");
      const newUrl = formUrlQuery2({
        params: searchParams.toString(),
        key: "type",
        value: null,
        path: pathname,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActiveType(value);
      const url = formUrlQuery2({
        params: searchParams.toString(),
        key: "type",
        value,
        path: pathname,
      });
      router.push(url, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((filter) => (
          <button
            type="button"
            key={filter.value}
            className={`light-border-2 small-medium 
            rounded-2xl px-5 py-2 capitalize 
            dark:text-light-800 dark:hover:text-primary-500
            ${
              activeType === filter.value
                ? "bg-primary-500 text-light-900"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"
            }`}
            onClick={() => handleTypeClick(filter.value)}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
