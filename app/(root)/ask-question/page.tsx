import Questions from "@/components/forms/Questions";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const AskQuestion = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold">Ask a public Question</h1>
      <div className="mt-9">
        <Questions user={JSON.stringify(user?._id)} />
      </div>
    </div>
  );
};

export default AskQuestion;
