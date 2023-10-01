"use server";

import Question from "@/database/Question.model";
import { connectToDatabase } from "../mongoose";
import Tag, { ITag } from "@/database/Tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User, { IUser } from "@/database/User.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const questions = await Question.find()
      .populate<{ tags: ITag[] }>({ path: "tags", model: Tag })
      .populate<{ author: IUser }>({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();
    const { title, content, author, tags, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];
    for (const tag of tags) {
      /**
       * $setOnInsert: This is a MongoDB operator that sets the value of a field only if the update operation results in an insert. In this case, it sets the name field of the document to the value of the tag variable if the document is being inserted (i.e., it doesn't already exist).
       * $push: This is a MongoDB operator that appends a value to an array field. In this case, it appends the _id of the question object to the questions array field of the document.
       * upsert: This is a boolean value that specifies whether the operation should create a new document if no document matches the query. In this case, it is set to true, which means that a new document will be created if no document matches the query.
       * new: This is a boolean value that specifies whether the updated document should be returned. In this case, it is set to true, which means that the updated document will be returned.
       * if upsert is set to false, then $setOnInsert will not work.
       * $push will be applied always whether it's insert or update operation
       */
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }
    /**
     * The $each operator is used to append multiple values to an array field at once. It is used in conjunction with the $push operator to add multiple elements to an array field
     */
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
