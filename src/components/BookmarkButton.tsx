import { kyInstance } from "@/lib/ky";
import { bookmarkInfoProp } from "@/lib/types";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark, Heart } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface BookmarkButtonProps {
  postId: string;
  initialState: bookmarkInfoProp;
}

const BookmarkButton = ({ postId, initialState }: BookmarkButtonProps) => {
  const queryKey: QueryKey = ["bookmark-info", postId];

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmark`).json<bookmarkInfoProp>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
        : kyInstance.post(`/api/posts/${postId}/bookmark`),
    onMutate: async () => {
      toast({
        description: `Post ${data.isBookmarkedByUser ? "un" : ""}Bookmarked`,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousState =
        queryClient.getQueryData<bookmarkInfoProp>(queryKey);

      queryClient.setQueryData<bookmarkInfoProp>(queryKey, () => {
        return {
          isBookmarkedByUser: !previousState?.isBookmarkedByUser,
        };
      });

      return { previousState };
    },
    onError(error, variables, context) {
      console.log(error);
      queryClient.setQueryData<bookmarkInfoProp>(
        queryKey,
        context?.previousState,
      );

      toast({
        variant: "destructive",
        description: "Something went wrong, please try again",
      });
    },
  });
  return (
    <button
      className="flex items-center gap-2"
      onClick={() => mutation.mutate()}
    >
      <Bookmark
        className={`size-5 ${data.isBookmarkedByUser && "fill-primary text-primary"}`}
      />
    </button>
  );
};

export default BookmarkButton;
