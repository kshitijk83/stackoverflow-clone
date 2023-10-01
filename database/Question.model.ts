import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  content: string;
  tags: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  views: number;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  answers: Types.ObjectId[];
  author: Types.ObjectId;
}

const QuestionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

const Question: Model<IQuestion> =
  models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
