import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface Props {
  title?: string;
  description?: string;
  link?: string;
  linkTitle?: string;
}

const NoResults = ({ title, description, link, linkTitle }: Props) => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
        alt="No results found"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        width={270}
        height={200}
        className="hidden object-contain dark:flex"
        alt="No results found"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8 text-center">
        {title || "No results found"}
      </h2>
      <p
        className="body-regular text-dark500_light700 my-3.5
      max-w-md text-center"
      >
        {description || ""}
      </p>
      <Link href={link || "/"}>
        <Button
          className="paragraph-medium mt-5 min-h-[46px]
        rounded-lg bg-primary-500 px-4
        py-3 text-light-900"
        >
          {linkTitle || "Go to home"}
        </Button>
      </Link>
    </div>
  );
};

export default NoResults;
