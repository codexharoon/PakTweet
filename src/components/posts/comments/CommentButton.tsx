// comment button for post

import { PostProp } from "@/lib/types";
import { MessageSquare } from "lucide-react";

interface CommentButtonProps {
  post: PostProp;
  onClick: () => void;
}
export function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2"
    >
      <MessageSquare className="size-5" />
      <span>
        {post._count.comments}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
