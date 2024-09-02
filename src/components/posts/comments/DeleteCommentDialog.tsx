import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { CommentProp } from "@/lib/types";
import { useDeleteComment } from "./mutation";

interface DeleteCommentDialogProps {
  comment: CommentProp;
  open: boolean;
  onClose: () => void;
}

const DeleteCommentDialog = ({
  comment,
  open,
  onClose,
}: DeleteCommentDialogProps) => {
  const mutation = useDeleteComment();

  function handleOpenChange(open: boolean) {
    if (!open && !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Comment?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"outline"}
            disabled={mutation.isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <LoadingButton
            variant={"destructive"}
            loading={mutation.isPending}
            onClick={() => mutation.mutate(comment.id)}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCommentDialog;
