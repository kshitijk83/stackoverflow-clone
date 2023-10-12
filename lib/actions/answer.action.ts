"use server";

import Answer, { IAnswer } from "@/database/Answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/Question.model";
import { revalidatePath } from "next/cache";
import { IUser } from "@/database/User.model";
import { Types } from "mongoose";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    const { author, content, path, question } = params;
    const newAnswer = await Answer.create({
      author: Types.ObjectId.createFromHexString(author.trim()),
      content,
      path,
      question: Types.ObjectId.createFromHexString(question.trim()),
    });

    // Add the answer to the question->answers array
    await Question.findByIdAndUpdate(
      Types.ObjectId.createFromHexString(question.trim()),
      { $push: { answers: newAnswer._id } },
      { new: true }
    );

    // Add interaction

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const answers = await Answer.find({
      question: Types.ObjectId.createFromHexString(questionId),
    })
      .populate<{
        author: IUser;
      }>({ path: "author", model: "User" })
      .sort({ createdAt: -1 });

    return { answers };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function voteAnswer(
  params: AnswerVoteParams & { type: "upvote" | "downvote" }
) {
  try {
    connectToDatabase();

    const { answerId, userId, hasdownVoted, hasupVoted, path, type } = params;

    let updateQuery: any = {};
    if (type === "upvote") {
      if (hasupVoted) {
        updateQuery = {
          $pull: { upvotes: userId },
        };
      } else {
        updateQuery = {
          $pull: { downvotes: userId },
          $push: { upvotes: userId },
        };
      }
    } else {
      // downvote
      if (hasdownVoted) {
        updateQuery = {
          $pull: { downvotes: userId },
        };
      } else {
        updateQuery = {
          $push: { downvotes: userId },
          $pull: { upvotes: userId },
        };
      }
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // incerment author's reputation +10 for upvote

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}