import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filters from "@/components/shared/Filters";
import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
// import { useTheme } from "@/context/ThemeProvider";
import { getQuestions } from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
// import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

import type { Metadata } from "next";
import { useSearchParams } from "next/navigation";
import { Suspense, useDeferredValue } from "react";
import QuestionList from "@/components/shared/skeletons/QuestionList";

export const metadata: Metadata = {
  title: "StackOverFlow Clone",
  description: "blah blah blah",
};

export default async function Home({ searchParams }: SearchParamsProps) {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full ">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask a question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Questions"
          otherClasses="flex-1"
        />

        <Filters
          placeholder="Theme"
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />
      <Suspense
        key={searchParams.q + searchParams.filter}
        fallback={<QuestionList />}
      >
        <QuestionsContainer searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function QuestionsContainer({ searchParams }) {
  const q = searchParams.q;
  const filter = searchParams.filter;
  const page = searchParams.page ? +searchParams.page : 1;
  const { questions, isNext } = await getQuestions({
    searchQuery: q,
    filter,
    page,
  });

  return (
    <>
      <div className="mt-10 flex flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              clerkId={question.author.clerkId}
              key={question._id.toString()}
              _id={question._id.toString()}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResults
            title="There is no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <Pagination isNext={isNext} pageNumber={page} />
    </>
  );
}
