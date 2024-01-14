import React from "react";
import Filters from "./Filters";
import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimeStamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import { ObjectId } from "mongoose";
import Pagination from "./Pagination";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  filter,
  page,
}: Props) => {
  const { answers, isNext } = await getAnswers({
    questionId,
    sortBy: filter,
    page: page ? +page : 1,
  });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filters filters={AnswerFilters} placeholder="Select Filter" />
      </div>
      <div>
        {answers.map((answer) => (
          <article
            key={JSON.stringify(answer._id)}
            className="light-border mb-5 border-b py-10"
          >
            <div className="flex items-center justify-between">
              <div
                className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row
              sm:items-center sm:gap-2"
              >
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.avatar || "/assets/images/avatar.png"}
                    width={18}
                    height={18}
                    alt="profile picture"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>
                    <p
                      className="small-regular text-light400_light500 mt-0.5
                    line-clamp-1"
                    >
                      <span className="max-sm:hidden">&nbsp;-&nbsp;</span>
                      answered {getTimeStamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <Votes
                    type="answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={userId}
                    upvotes={answer!.upvotes.length}
                    hasUpvoted={answer!.upvotes.includes(JSON.parse(userId))}
                    downvotes={answer!.downvotes.length}
                    hasDownvoted={answer!.downvotes.includes(
                      JSON.parse(userId)
                    )}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
      <div className="mt-8 w-full">
        <Pagination pageNumber={page ? +page : 1} isNext={isNext} />
      </div>
    </div>
  );
};

export default AllAnswers;
