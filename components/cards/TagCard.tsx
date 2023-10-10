import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import { Badge } from "../ui/badge";

interface Props {
  tag: {
    _id: string;
    name: string;
    description: string;
    questions: any[];
  };
}

const TagCard = ({ tag: { _id, name, description, questions } }: Props) => {
  return (
    <Link
      href={`/tags/${_id}`}
      className="shadow-light100_darknone
    w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article
        className="background-light900_dark200 light-border flex w-full flex-col
      justify-center gap-6 rounded-2xl border
      px-8 py-10"
      >
        <div className="flex justify-between gap-2">
          <Badge
            className={`paragraph-semibold background-light800_dark400
            text-dark300_light900 rounded-md border-none px-4 py-2 normal-case`}
          >
            {name}
          </Badge>
        </div>
        <p className="body-regular text-dark200_light800">{description}</p>
        <p className="text-dark400_light500 small-medium mt-2.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {questions.length}+
          </span>{" "}
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
