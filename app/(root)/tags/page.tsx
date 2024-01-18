import TagCard from "@/components/cards/TagCard";
import UserCard from "@/components/cards/UserCard";
import Filters from "@/components/shared/Filters";
import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import { Link } from "lucide-react";
import React, { Suspense } from "react";
import { TagsListLoading } from "./loading";

const TagsPage = async ({ searchParams }: SearchParamsProps) => {
  return (
    <div className="flex flex-col gap-12">
      <h1 className="h1-bold text-dark100_light900">Tags</h1>
      <div className="flex justify-between gap-8">
        <LocalSearchBar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search Tags..."
          otherClasses="flex-1"
        />
        <Filters
          placeholder="Select a Filter"
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <Suspense
        key={searchParams.q + searchParams.filter}
        fallback={<TagsListLoading />}
      >
        <TagsListCon searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default TagsPage;

async function TagsListCon({ searchParams }) {
  const { tags, isNext } = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <section className="flex flex-wrap items-center gap-4">
        {tags.length > 0 ? (
          tags.map((tag) => <TagCard key={tag._id} tag={tag} />)
        ) : (
          <NoResults
            title="There is no tag to show"
            description="You can create one by clicking the button below"
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </section>
      <Pagination
        pageNumber={searchParams.page ? +searchParams.page : 1}
        isNext={isNext}
      />
    </>
  );
}
