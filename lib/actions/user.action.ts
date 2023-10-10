"use server";

import User from "@/database/User.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetUserByIdParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/Question.model";

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
    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (err) {
    console.log(err);
    throw err;
  }
}
