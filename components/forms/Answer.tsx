"use client";

import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeProvider";
import { AnswersSchema } from "@/lib/validations";
import { Button } from "../ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createAnswer } from "@/lib/actions/answer.action";

const Answer = ({
  userId,
  questionId,
}: {
  userId: string;
  questionId: string;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();
  const form = useForm<z.infer<typeof AnswersSchema>>({
    resolver: zodResolver(AnswersSchema),
    defaultValues: {
      answer: "",
    },
  });
  const editorRef = useRef(null);
  const { mode } = useTheme();

  const submitHandler = async (data: z.infer<typeof AnswersSchema>) => {
    setSubmitting(true);
    try {
      // make api call
      await createAnswer({
        author: userId,
        content: data.answer,
        question: questionId,
        path: pathname,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div
        className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-center
      sm:gap-2"
      >
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          onClick={() => {}}
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
        >
          <Image
            src="/assets/icons/stars.svg"
            alt="star icon"
            width={12}
            height={12}
            className="object-contain"
          />
          Generate Ai Answer
        </Button>
      </div>
      <Form {...form}>
        <form
          className=" mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(submitHandler)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    initialValue=""
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "codesample | bold italic forecolor | alignleft aligncenter | " +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family:Inter, font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "default",
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
