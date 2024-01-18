import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const QuestionList = () => {
  return (
    <div className="mt-4 flex flex-col gap-6">
      {[1, 2].map((item) => (
        <Skeleton key={item} className="h-48 w-full rounded-xl" />
      ))}
    </div>
  );
};

export default QuestionList;
