"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteActions = ({ type, itemId }: Props) => {
  const pathName = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    console.log("edit");
    router.push(`/question/edit/${itemId}`);
  };
  const handleDelete = async () => {
    if (type === "Question") {
      console.log("delete question");
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathName });
    }
    if (type === "Answer") {
      console.log("delete answer");
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathName });
    }
  };
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit icon"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      {/* {type === "Question" && ( */}
      <Image
        src="/assets/icons/trash.svg"
        alt="delete icon"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
      {/* )} */}
    </div>
  );
};

export default EditDeleteActions;
