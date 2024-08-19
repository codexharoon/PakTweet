"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { PostDataProp } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Post from "@/components/posts/Post";
import { kyInstance } from "@/lib/ky";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton, {
  PostLoadingSkeleton,
} from "@/components/posts/PostsLoadingSkeleton";

const Following = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/posts/following", {
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
        An error occurred while fetching the posts. Please try again later.
      </p>
    );
  }

  const posts = data.pages.flatMap((page) => page.posts);

  if (status === "success" && !hasNextPage && posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Nothing to show here. Follow some users to see their posts!
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

      {/* {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />} */}
      {isFetchingNextPage && <PostLoadingSkeleton />}
    </InfiniteScrollContainer>
  );
};

export default Following;
