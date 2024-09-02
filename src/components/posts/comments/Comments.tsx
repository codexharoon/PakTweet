"use client";

import { CommentDataProp, PostProp } from "@/lib/types";
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import { kyInstance } from "@/lib/ky";
import { Loader2 } from "lucide-react";
import Comment from "./Comment";
import { Button } from "@/components/ui/button";

interface CommentsProps {
  post: PostProp;
}

const Comments = ({ post }: CommentsProps) => {
  const {
    data,
    status,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", post.id],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(`/api/posts/${post.id}/comment`, {
          searchParams: pageParam ? { cursor: pageParam } : {},
        })
        .json<CommentDataProp>(),
    initialPageParam: null as string | null,
    getNextPageParam: (firstPage) => firstPage.previousCursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-3">
      <CommentInput post={post} />

      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}

      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}

      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while fetching the comments. Please try again later.
        </p>
      )}

      {hasNextPage && (
        <Button
          variant={"link"}
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? (
            <Loader2 className="mx-auto animate-spin" />
          ) : (
            "Load previous comments"
          )}
        </Button>
      )}

      <div className="max-h-[440px] divide-y overflow-y-auto">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
