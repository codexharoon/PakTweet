import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteComment, postComment } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { CommentDataProp } from "@/lib/types";

export function useSubmitComment(postId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["comments", postId];

  const mutation = useMutation({
    mutationFn: postComment,
    onSuccess: async (newComment) => {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentDataProp, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData?.pageParams,
              pages: [
                {
                  comments: [...firstPage.comments, newComment],
                  previousCursor: firstPage.previousCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });
    },
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to post comment, please try again later",
      });
    },
  });

  return mutation;
}

export function useDeleteComment() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deleteComment) => {
      const queryKey: QueryKey = ["comments", deleteComment.postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentDataProp, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData?.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter(
                (comment) => comment.id !== deleteComment.id,
              ),
            })),
          };
        },
      );

      toast({
        description: "Comment deleted successfully",
      });
    },
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to post comment, please try again later",
      });
    },
  });

  return mutation;
}
