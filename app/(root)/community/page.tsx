import UserCard from "@/components/cards/UserCard";
import Filters from "@/components/shared/Filters";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import React from "react";

const CommunityPage = async ({ searchParams }: SearchParamsProps) => {
  const { users, isNext } = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <div className="flex flex-col gap-12">
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="flex justify-between gap-8">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search who are using this..."
          otherClasses="flex-1"
        />
        <Filters
          placeholder="Select a Filter"
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="flex flex-wrap justify-between gap-4">
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user.username} user={user} />)
        ) : (
          <div
            className="paragraph-regular text-dark200_light800
          mx-auto max-w-4xl text-center"
          >
            <p>No users yet</p>
            <Link
              href="/sign-up"
              className="mt-2 font-bold
            text-accent-blue"
            >
              Join here.. it&apos;s never too late
            </Link>
          </div>
        )}
      </section>
      <Pagination
        pageNumber={searchParams.page ? +searchParams.page : 1}
        isNext={isNext}
      />
    </div>
  );
};

export default CommunityPage;
