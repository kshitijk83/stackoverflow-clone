import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="flex w-full flex-col">
        <div
          className="flex w-full flex-col-reverse justify-between gap-5
    sm:flex-row sm:items-center sm:gap-2"
        >
          <Skeleton className="h-6 w-6 rounded-full" />
          <div className="flex justify-end">
            <Skeleton className="h-6 w-8" />
          </div>
        </div>
        <Skeleton className="mt-6 h-6 w-full" />
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-[580px] w-full" />
    </>
  );
};

export default Loading;

export const AllAnswersLoading = () => {
  return (
    <div className="mb-10 mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient"> Answers</h3>
      </div>
      <Skeleton className="my-4 h-8 w-40" />
      <div>
        <Skeleton className="h-40 w-full" />
      </div>
      <div className="mt-8 w-full">
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
};
export const AnswerLoading = () => {
  return (
    <div>
      <div
        className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-center
        sm:gap-2"
      >
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
      </div>
      <div>
        <div className=" mt-6 flex w-full flex-col gap-10">
          <Skeleton className="h-40 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
};
