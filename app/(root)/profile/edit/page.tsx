import React from "react";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Profile from "@/components/forms/Profile";

const EditProfilePage = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question Page</h1>

      <div className="mt-9">
        <Profile
          clerkId={userId}
          user={JSON.parse(JSON.stringify(mongoUser))}
        />
      </div>
    </>
  );
};

export default EditProfilePage;
