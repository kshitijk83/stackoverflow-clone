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

    const { searchQuery, filter, page = 1, pageSize = 2 } = params;

    const filterQuery: FilterQuery<ITag> = {};

    if (searchQuery) {
      filterQuery.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;

      case "recent":
        sortOptions = { createdAt: -1 };
        break;

      case "name":
        sortOptions = { name: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find(filterQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOptions);

    const totalTags = await Tag.countDocuments(filterQuery);
    const isNext = page * pageSize < totalTags;

    return { tags, isNext };
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
