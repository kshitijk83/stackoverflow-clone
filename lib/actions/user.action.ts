"use server";

import User, { IUser } from "@/database/User.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question, { IQuestion } from "@/database/Question.model";
import Tag, { ITag } from "@/database/Tag.model";
import Answer from "@/database/Answer.model";
import { FilterQuery } from "mongoose";

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(userData);
    return newUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateUser(userData: UpdateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.findOneAndUpdate(
      { clerkId: userData.clerkId },
      userData.updateData,
      { new: true }
    );

    revalidatePath(userData.path);
    return newUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export async function deleteUser(userData: DeleteUserParams) {
  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId: userData.clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete user's question, answers, comments, etc.

    //  get all questions by user
    // const userQuestionsIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // delete all questions by user
    await Question.deleteMany({ author: user._id });

    // TODO: delete all answers, comments, etc. by user

    // finally delete user
    const deletedUser = await User.findByIdAndDelete({ clerkId: user._id });

    return deletedUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 2 } = params;

    const query: FilterQuery<IUser> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { username: { $regex: searchQuery, $options: "i" } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;

      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;

      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }
    const users = await User.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOptions);

    const totalUsers = await User.countDocuments(query);
    const isNext = page * pageSize < totalUsers;
    return { users, isNext };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAllSavedQuestion(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const { clerkId, filter, page = 1, pageSize = 2, searchQuery } = params;

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;

      case "oldest":
        sortOptions = { createdAt: 1 };
        break;

      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;

      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate<{
      saved: (Omit<IQuestion, "author"> & { author: IUser })[];
    }>({
      path: "saved",
      match: searchQuery
        ? {
            $or: [
              { title: { $regex: searchQuery, $options: "i" } },
              { content: { $regex: searchQuery, $options: "i" } },
            ],
          }
        : {},
      options: {
        skip: (page - 1) * pageSize,
        limit: pageSize,
        sort: sortOptions,
      },
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
    if (!user) {
      throw new Error("User not found");
    }
    const isNext = user.saved.length === pageSize;
    return { questions: user.saved as any, isNext };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.find({
      author: user._id,
    }).countDocuments();
    const totalAnswers = await Answer.find({
      author: user._id,
    }).countDocuments();
    return { user, totalAnswers, totalQuestions };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 2 } = params;
    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1 })
      .populate<{ tags: ITag[] }>({ path: "tags", model: Tag })
      .populate<{ author: IUser }>({ path: "author", model: User })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      totalQuestions,
      questions: userQuestions,
      page,
      pageSize,
      isNext: totalQuestions > page * pageSize,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 2 } = params;
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ views: -1 })
      .populate<{ question: IQuestion[] }>({
        path: "question",
        model: Question,
      })
      .populate<{ author: IUser }>({ path: "author", model: User })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      totalAnswers,
      answers: userAnswers,
      page,
      pageSize,
      isNext: totalAnswers > page * pageSize,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}
