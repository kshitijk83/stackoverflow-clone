"use server";

import Question from "@/database/Question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import Answer from "@/database/Answer.model";
import User from "@/database/User.model";
import Tag from "@/database/Tag.model";

const searchableTypes = ["question", "answer", "user", "tag"];
export const globalSearch = async (params: SearchParams) => {
  try {
    await connectToDatabase();

    const { query, type } = params;
    let results = [];
    const regexQuery = { $regex: query, $options: "i" };
    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: User, searchField: "name", type: "user" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLower = type.toLowerCase();
    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // search everything
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);
        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                ? item.question
                : item._id,
          }))
        );
      }
    } else {
      const modelInfo = modelsAndTypes.find((m) => m.type === typeLower);
      if (!modelInfo) {
        throw new Error("Invalid type");
      }

      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(2);

      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
            ? item.question
            : item._id,
      }));

      return JSON.stringify(results);
    }
    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
