"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

const topQuestions = [
  {
    _id: "1",
    title:
      "Would it be appropriate to point out an error in another paper during a referee report?",
  },
  {
    _id: "2",
    title: "How can an airconditioning machine exist?",
  },
  {
    _id: "3",
    title: "Interrogated every time crossing UK Border as citizen",
  },
  {
    _id: "4",
    title: "Low digit addition generator",
  },
  {
    _id: "5",
    title: "What is an example of 3 numbers that do not make up a vector?",
  },
];

// give me array of objects for popular tags section having tag, count property for top tags used in questions

const popularTags = [
  {
    _id: "1",
    name: "JavaScript",
    totalQuestions: 3000,
  },
  {
    _id: "2",
    name: "Next.JS",
    totalQuestions: 345,
  },
  {
    _id: "3",
    name: "React.JS",
    totalQuestions: 123,
  },
  {
    _id: "4",
    name: "Node.JS",
    totalQuestions: 111,
  },
  {
    _id: "5",
    name: "Python",
    totalQuestions: 1,
  },
  {
    _id: "6",
    name: "Microsoft Azure",
    totalQuestions: 3,
  },
  {
    _id: "7",
    name: "Machine Learning",
    totalQuestions: 33,
  },
];

const RightSideBar = () => {
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
              href={`/questions/${item._id}`}
              key={item._id}
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
              totalQuestions={item.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
