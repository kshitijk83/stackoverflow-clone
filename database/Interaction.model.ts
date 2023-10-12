import { Document, Model, Schema, model, models } from "mongoose";

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId;
  answer: Schema.Types.ObjectId;
  tag: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  action: string;
  createdAt: Date;
}

const InteractionSchema = new Schema<IInteraction>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  tag: { type: Schema.Types.ObjectId, ref: "Tag" },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  action: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Interaction: Model<IInteraction> =
  models.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
