import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";

interface Props {
  user: {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
    clerkId: string;
  };
}
const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone
      w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article
        className="background-light900_dark200 light-border
      flex w-full flex-col items-center justify-center rounded-2xl
      border p-8"
      >
        <Image
          src={user.avatar || "/assets/images/avatar.png"}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3
            className="h3-bold text-dark200_light900
          line-clamp-1"
          >
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>
        <div className="mt-5 flex items-center gap-2">
          {interactedTags.length > 0 ? (
            interactedTags.map((tag) => (
              <RenderTag _id={tag._id} name={tag.name} key={tag._id} />
            ))
          ) : (
            <Badge>No Tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
