import { CommentDataProp, PostProp } from "@/lib/types";
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import { kyInstance } from "@/lib/ky";
import { Loader2 } from "lucide-react";
import Comment from "./Comment";

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
    // select(data) {
    //     //
    // },
  });

  if (status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while fetching the comments. Please try again later.
      </p>
    );
  }

  const comments = data.pages.flatMap((page) => page.comments);

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
