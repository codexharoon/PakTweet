import { Button } from "@/components/ui/button";
import { useSubmitComment } from "./mutation";
import { PostProp } from "@/lib/types";
import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const CommentInput = ({ post }: { post: PostProp }) => {
  const mutation = useSubmitComment(post.id);

  const [input, setInput] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim() || mutation.isPending) return;

    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => {
          setInput("");
        },
      },
    );
  }
  return (
    <form onSubmit={onSubmit} className="flex w-full items-center gap-2">
      <Input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        placeholder="Write a comment..."
        autoFocus
      />

      <Button
        type="submit"
        variant={"ghost"}
        size={"icon"}
        disabled={!input.trim() || mutation.isPending}
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <SendHorizonal />
        )}
      </Button>
    </form>
  );
};

export default CommentInput;
