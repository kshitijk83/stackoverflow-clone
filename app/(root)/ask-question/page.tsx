import Questions from "@/components/Questions";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

const AskQuestion = async () => {
  const userId = "12345";

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserById({ userId });

  console.log("user", user);

  return (
    <div>
      <h1 className="h1-bold">Ask a public Question</h1>
      <div className="mt-9">
        <Questions user={JSON.stringify(user)} />
      </div>
    </div>
  );
};

export default AskQuestion;
