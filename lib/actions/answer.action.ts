"use server";

import Answer, { IAnswer } from "@/database/Answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/Question.model";
import { revalidatePath } from "next/cache";
import { IUser } from "@/database/User.model";
import { Types } from "mongoose";
import Interaction from "@/database/Interaction.model";
import { timer } from "../utils";

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
    const { questionId, sortBy, page = 1, pageSize = 2 } = params;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;

      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;

      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const answers = await Answer.find({
      question: Types.ObjectId.createFromHexString(questionId),
    })
      .populate<{
        author: IUser;
      }>({ path: "author", model: "User" })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOptions);

    const totalAnswers = await Answer.countDocuments({
      question: Types.ObjectId.createFromHexString(questionId),
    });
    const isNext = page * pageSize < totalAnswers;
    await timer(3000);
    return { answers, isNext };
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

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    await Answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );

    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
