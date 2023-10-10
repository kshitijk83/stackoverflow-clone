import { Model, model, models, Schema, Types } from "mongoose";

export interface IAnswer {
  author: Types.ObjectId;
  content: string;
  question: Types.ObjectId;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  question: {
    ref: "Question",
    type: Schema.Types.ObjectId,
    required: true,
  },
  upvotes: [
    {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
  ],
  downvotes: [
    {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Answer: Model<IAnswer> =
  models.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
