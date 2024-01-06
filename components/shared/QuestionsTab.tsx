import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId: string;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
  });
  return (
    <>
      {result.questions.map((question) => (
        <QuestionCard
          key={question._id.toString()}
          _id={question._id.toString()}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
      <Pagination isNext={result.isNext} pageNumber={result.page} />
    </>
  );
};

export default QuestionsTab;
