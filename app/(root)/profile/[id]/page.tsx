import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMonthAndYear } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import Link from "next/link";
import QuestionsTab from "@/components/shared/QuestionsTab";
import AnswersTab from "@/components/shared/AnswersTab";
import { LoadingProfileQuestions } from "./loading";

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId } = auth();
  const { user, totalAnswers, totalQuestions } = await getUserInfo({
    userId: params.id,
  });

  // return <LoadingProfileQuestions />;

  return (
    <>
      <div className="flex flex-col-reverse items-center justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={user.avatar || "/assets/icons/avatar.png"}
            width={140}
            height={140}
            alt="avatar"
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{user.name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-5">
              {user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={user.portfolioWebsite}
                  title="Portfolio"
                />
              )}
              {user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={user.location}
                />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getMonthAndYear(user.joinedAt)}
              />
            </div>
            {user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {userId === user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats totalAnswers={totalAnswers} totalQuestions={totalQuestions} />
      <Suspense fallback={<LoadingProfileQuestions />}>
        <div className="mt-10 flex gap-10">
          <Tabs defaultValue="top-posts" className="flex-1">
            <TabsList className="background-light800_dark400 min-h-[42px] p-1">
              <TabsTrigger value="top-posts" className="tab">
                Top Posts
              </TabsTrigger>
              <TabsTrigger value="answers" className="tab">
                Answers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="top-posts">
              <QuestionsTab
                clerkId={user.clerkId}
                searchParams={searchParams}
                userId={user._id}
              />
            </TabsContent>
            <TabsContent value="answers" className="flex w-full flex-col gap-6">
              <AnswersTab
                clerkId={user.clerkId}
                searchParams={searchParams}
                userId={user._id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Suspense>
    </>
  );
};

export default Page;
