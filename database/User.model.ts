import { Document, Model, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  username: string;
  name: string;
  email: string;
  password?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  portfolioWebsite?: string;
  reputation?: number;
  saved: Schema.Types.ObjectId[];
  joinedAt: Date;
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  bio: { type: String },
  avatar: { type: String, required: true },
  location: { type: String },
  portfolioWebsite: { type: String },
  reputation: { type: Number, default: 0 },
  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  joinedAt: { type: Date, default: Date.now },
});

const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);

export default User;
