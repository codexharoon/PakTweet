import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "../ui/loading-button";
import useDeletePostMutation from "./mutation";
import { PostProp } from "@/lib/types";

interface DeletePostDialogProps {
  post: PostProp;
  open: boolean;
  onClose: () => void;
}

const DeletePostDialog = ({ post, open, onClose }: DeletePostDialogProps) => {
  const { mutation } = useDeletePostMutation();

  function handleOpenChange(open: boolean) {
    if (!open && !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
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
            onClick={() => mutation.mutate(post.id)}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostDialog;
