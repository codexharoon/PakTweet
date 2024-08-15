"use client";

import { useQuery } from "@tanstack/react-query";
import { PostProp } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Post from "@/components/posts/Post";
import { kyInstance } from "@/lib/ky";

type QueryProps = {
  posts: PostProp[];
};

const ForYouFeed = () => {
  const query = useQuery<QueryProps>({
    queryKey: ["post-feed", "for-you"],
    queryFn: kyInstance.get("/api/posts/for-you").json<QueryProps>,
  });

  if (query.status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (query.status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while fetching the posts. Please try again later.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {query.data.posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default ForYouFeed;
