"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { PostDataProp } from "@/lib/types";
import Post from "@/components/posts/Post";
import { kyInstance } from "@/lib/ky";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton, {
  PostLoadingSkeleton,
} from "@/components/posts/PostsLoadingSkeleton";

const Bookmarks = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "bookmarks"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/posts/bookmark", {
          searchParams: pageParam ? { cursor: pageParam } : {},
        })
        .json<PostDataProp>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while fetching the bookmarks. Please try again later.
      </p>
    );
  }

  const posts = data.pages.flatMap((page) => page.posts);

  if (status === "success" && !hasNextPage && posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        You haven&apos;t bookmarked any posts.
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

export default Bookmarks;
