"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { forYouRouteDataProp } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Post from "@/components/posts/Post";
import { kyInstance } from "@/lib/ky";

const ForYouFeed = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/posts/for-you", {
          searchParams: pageParam ? { cursor: pageParam } : {},
        })
        .json<forYouRouteDataProp>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while fetching the posts. Please try again later.
      </p>
    );
  }

  const posts = data.pages.flatMap((page) => page.posts);

  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default ForYouFeed;
