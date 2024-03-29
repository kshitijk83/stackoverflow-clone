"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { MoveIcon } from "@radix-ui/react-icons";

interface Props {
  pageNumber: number;
  isNext: boolean;
}

function Pagination({ pageNumber, isNext }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const handleNavigation = (type: "prev" | "next") => {
    const nextPageNumber = type === "prev" ? pageNumber - 1 : pageNumber + 1;

    const value = nextPageNumber > 1 ? nextPageNumber.toString() : null;

    const newUrl = formUrlQuery({
      pathName,
      params: searchParams.toString(),
      key: "page",
      value,
    });

    startTransition(() => {
      router.push(newUrl, { scroll: false });
    });
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="mt-3 flex w-full items-center justify-center gap-2">
      <Button
        onClick={() => handleNavigation("prev")}
        disabled={pageNumber === 1}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>

      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">
          {" "}
          {!isPending ? (
            pageNumber
          ) : (
            <MoveIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
        </p>
      </div>

      <Button
        onClick={() => handleNavigation("next")}
        disabled={!isNext}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
}

export default Pagination;
