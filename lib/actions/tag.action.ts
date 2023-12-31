"use server";

import User, { IUser } from "@/database/User.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/Tag.model";
import Question, { IQuestion } from "@/database/Question.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Find interation by the user

    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
      { _id: "3", name: "tag3" },
    ];
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery } = params;

    const filter: FilterQuery<ITag> = {};

    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const tags = await Tag.find(filter).sort({ createdAt: -1 });

    return { tags };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getQuestionsByTag(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, page, pageSize, searchQuery } = params;

    const tag = await Tag.findById(tagId).populate<{
      questions: (Omit<IQuestion, "author" | "tags"> & {
        author: IUser;
        tags: ITag[];
      })[];
    }>({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "author",
          model: User,
        },
        {
          path: "tags",
          model: Tag,
        },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    return { tagTitle: tag.name, questions: tag.questions };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          numOfQuestions: { $size: "$questions" },
        },
      },
      {
        $sort: {
          numOfQuestions: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
    console.log(popularTags);
    return popularTags;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
