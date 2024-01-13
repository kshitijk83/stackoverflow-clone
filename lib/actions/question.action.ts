"use server";

import Question from "@/database/Question.model";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "../mongoose";
import Tag, { ITag } from "@/database/Tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  ToggleSaveQuestionParams,
} from "./shared.types";
import User, { IUser } from "@/database/User.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/Answer.model";
import Interaction from "@/database/Interaction.model";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate<{ tags: ITag[] }>({ path: "tags", model: Tag })
      .populate<{ author: IUser }>({ path: "author", model: User })
      .sort(sortOptions);

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

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate<{ tags: ITag[] }>({ path: "tags", model: Tag })
      .populate<{ author: IUser }>({ path: "author", model: User });
    return { question: JSON.parse(JSON.stringify(question)) };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasdownVoted, hasupVoted, path } = params;

    let updateQuery;
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $push: { upvotes: userId },
        $pull: { downvotes: userId },
      };
    } else {
      updateQuery = { $push: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // incerment author's reputation +10 for upvote

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasdownVoted, hasupVoted, path } = params;

    let updateQuery;
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $push: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // incerment author's reputation +10 for upvote

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function voteQuestion(
  params: QuestionVoteParams & { type: "upvote" | "downvote" }
) {
  try {
    connectToDatabase();

    const { questionId, userId, hasdownVoted, hasupVoted, path, type } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // incerment author's reputation +10 for upvote

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, userId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const hasSaved = user.saved.includes(questionId);

    let updateQuery;
    if (hasSaved) {
      updateQuery = {
        $pull: { saved: questionId },
      };
    } else {
      updateQuery = {
        $addToSet: { saved: questionId },
      };
    }
    // incerment author's reputation +10 for upvote
    await User.findByIdAndUpdate(userId, updateQuery, { new: true });
    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path, content, title } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;

    question.save();

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase();

    const question = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return question;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
