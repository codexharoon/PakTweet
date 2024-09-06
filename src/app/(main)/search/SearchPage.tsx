"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { PostDataProp } from "@/lib/types";
import Post from "@/components/posts/Post";
import { kyInstance } from "@/lib/ky";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton, {
  PostLoadingSkeleton,
} from "@/components/posts/PostsLoadingSkeleton";

const SearchPage = ({ query }: { query: string }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "search", query],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/search", {
          searchParams: {
            q: query,
            ...(pageParam ? { cursor: pageParam } : {}),
          },
        })
        .json<PostDataProp>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    gcTime: 0,
  });

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while fetching the SearchPage. Please try again later.
      </p>
    );
  }

  const posts = data.pages.flatMap((page) => page.posts);

  if (status === "success" && !hasNextPage && posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No result found for the search.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      {isFetchingNextPage && <PostLoadingSkeleton />}
    </InfiniteScrollContainer>
  );
};

export default SearchPage;
