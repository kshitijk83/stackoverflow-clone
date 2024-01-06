import Question from "@/database/Question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import User from "@/database/User.model";
import Interaction from "@/database/Interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, userId } = params;

    await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });

    if (userId) {
      const existingInteration = await Interaction.findOne({
        user: userId,
        question: questionId,
        action: "view",
      });

      if (existingInteration) {
        return console.log("Already viewed this question");
      }

      await Interaction.create({
        user: userId,
        question: questionId,
        action: "view",
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}
