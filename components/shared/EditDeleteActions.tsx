"use client";

import Image from "next/image";
import React from "react";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteActions = ({ type, itemId }: Props) => {
  const handleEdit = () => {
    console.log("edit");
  };
  const handleDelete = () => {
    if (type === "Question") {
      console.log("delete question");
    }
    if (type === "Answer") {
      console.log("delete answer");
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
      {type === "Question" && (
        <Image
          src="/assets/icons/trash.svg"
          alt="delete icon"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleDelete}
        />
      )}
    </div>
  );
};

export default EditDeleteActions;
