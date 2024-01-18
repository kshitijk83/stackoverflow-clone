import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mb-12 mt-11 flex flex-wrap items-center justify-between gap-5">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </div>
    </section>
  );
};

export default Loading;

export const TagsListLoading = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {[1, 2, 3].map((item) => (
        <Skeleton key={item} className="h-60 w-full rounded-2xl sm:w-[260px]" />
      ))}
    </div>
  );
};
