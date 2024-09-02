import { useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { CommentProp } from "@/lib/types";
import DeleteCommentDialog from "./DeleteCommentDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CommentMoreButtonProps {
  comment: CommentProp;
  className?: string;
}

const CommentMoreButton = ({ comment, className }: CommentMoreButtonProps) => {
  const [showDeleteCommentDialog, setShowDeleteCommentDialog] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"} className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteCommentDialog(true)}>
            <span className="flex items-center justify-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCommentDialog
        comment={comment}
        open={showDeleteCommentDialog}
        onClose={() => setShowDeleteCommentDialog(false)}
      />
    </>
  );
};

export default CommentMoreButton;
