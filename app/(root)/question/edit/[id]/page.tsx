import React from "react";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Questions from "@/components/forms/Questions";

const EditQuestionPage = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });
  const { question } = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question Page</h1>

      <div className="mt-9">
        <Questions
          type="Edit"
          user={mongoUser?._id.toString()}
          questionDetails={question}
        />
      </div>
    </>
  );
};

export default EditQuestionPage;
