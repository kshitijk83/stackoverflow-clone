import * as z from "zod";

export const QuestionsSchema = z.object({
  title: z.string().min(5),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const AnswersSchema = z.object({
  answer: z.string().min(100),
});

export const ProfileSchema = z.object({
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(50),
  bio: z.string().min(10).max(150),
  portfolioWebsite: z.string().url().optional(),
  location: z.string().min(3).max(50),
});
