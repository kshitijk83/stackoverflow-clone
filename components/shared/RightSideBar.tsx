import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";

const RightSideBar = async () => {
  const topQuestions = await getHotQuestions();
  const popularTags = await getPopularTags();
  return (
    <section
      className="background-light900_dark200 light-border custom-scrollbar sticky
      left-0 top-0 flex h-screen flex-col
      overflow-y-auto border-l p-6 pt-36 
    shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[330px]"
    >
      <div className="flex flex-1 flex-col gap-6">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className=" mt-7 flex w-full flex-col gap-[30px]">
          {topQuestions.map((item) => (
            <Link
              href={`/question/${item._id.toString()}`}
              key={item._id.toString()}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{item.title}</p>
              <Image
                className="invert-colors"
                src="/assets/icons/chevron-right.svg"
                alt="arrow-right"
                width={20}
                height={20}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className=" text-dark500_light700  mt-7 flex flex-col gap-4">
          {popularTags.map((item) => (
            <RenderTag
              key={item._id}
              _id={item._id}
              name={item.name}
              totalQuestions={item.numOfQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
