import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatAndDivideNumber, getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  const { question } = await getQuestionById({ questionId: params.id });

  const { userId: clerkId } = auth();
  if (!clerkId) {
    redirect("/sign-in");
  }

  const mongoUser = await getUserById({ userId: clerkId });

  return (
    <>
      <div className="flex w-full flex-col">
        <div
          className="flex w-full flex-col-reverse justify-between gap-5
        sm:flex-row sm:items-center sm:gap-2"
        >
          <Link
            href={`/profile/${question?.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={question?.author.avatar || "/assets/images/avatar.png"}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile picture"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question?.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={JSON.stringify(question!._id)}
              userId={JSON.stringify(mongoUser!._id)}
              upvotes={question!.upvotes.length}
              hasUpvoted={question!.upvotes.includes(mongoUser!._id)}
              downvotes={question!.downvotes.length}
              hasDownvoted={question!.downvotes.includes(mongoUser!._id)}
              hasSaved={mongoUser!.saved.includes(question!._id)}
            />
          </div>
        </div>
        <h2
          className="h2-semibold text-dark200_light900 mt-3.5
        w-full text-left"
        >
          {question!.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgSrc="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(question!.createdAt))}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgSrc="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(question!.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgSrc="/assets/icons/eye.svg"
          alt="views"
          value={formatAndDivideNumber(question!.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={question!.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {question?.tags.map((tag) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>
      <AllAnswers
        questionId={question!._id}
        userId={JSON.stringify(mongoUser!._id)}
        totalAnswers={question!.answers.length}
      />
      <Answer
        userId={mongoUser!._id.toString()}
        questionId={question!._id.toString()}
      />
    </>
  );
};

export default Page;
