"use client";

import { voteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  toggleSaveQuestion,
  voteQuestion,
} from "@/lib/actions/question.action";
import { formatAndDivideNumber } from "@/lib/utils";
import { ObjectId } from "mongoose";
import Image from "next/image";
import { usePathname } from "next/navigation";
import router, { useRouter } from "next/router";
import React, { useEffect } from "react";

interface Props {
  type: "answer" | "question";
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  // const router = useRouter();
  const handleVote = async (action: "upvote" | "downvote") => {
    if (!userId) return;
    try {
      if (type === "answer") {
        await voteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          type: action,
          hasdownVoted: hasDownvoted,
          hasupVoted: hasUpvoted,
          path: pathname,
        });
      } else if (type === "question") {
        await voteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          type: action,
          hasdownVoted: hasDownvoted,
          hasupVoted: hasUpvoted,
          path: pathname,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    try {
      await toggleSaveQuestion({
        path: pathname,
        questionId: JSON.parse(itemId),
        userId: JSON.parse(userId),
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // this is the main culprit here
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
    });
  }, [itemId, userId, pathname, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote icon"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />
          <div
            className="flex-center background-light700_dark400
          min-w-[18px] rounded-sm p-1"
          >
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote icon"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />
          <div
            className="flex-center background-light700_dark400
          min-w-[18px] rounded-sm p-1"
          >
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={() => handleSave()}
        />
      )}
    </div>
  );
};

export default Votes;
