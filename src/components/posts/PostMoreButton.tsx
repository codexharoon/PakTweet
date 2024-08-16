import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { PostProp } from "@/lib/types";
import DeletePostDialog from "./DeletePostDialog";

interface PostMoreButtonProps {
  post: PostProp;
  className?: string;
}

const PostMoreButton = ({ post, className }: PostMoreButtonProps) => {
  const [showDialog, setShowDialog] = React.useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"} className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDialog(true)}>
            <span className="flex items-center justify-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        post={post}
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};

export default PostMoreButton;
