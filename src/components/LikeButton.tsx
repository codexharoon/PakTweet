import { kyInstance } from "@/lib/ky";
import { likeInfoProp } from "@/lib/types";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface LikeButtonProps {
  postId: string;
  initialState: likeInfoProp;
}

const LikeButton = ({ postId, initialState }: LikeButtonProps) => {
  const queryKey: QueryKey = ["like-info", postId];

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/like`).json<likeInfoProp>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/like`)
        : kyInstance.post(`/api/posts/${postId}/like`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<likeInfoProp>(queryKey);

      queryClient.setQueryData<likeInfoProp>(queryKey, () => {
        return {
          likes:
            (previousState?.likes || 0) +
            (previousState?.isLikedByUser ? -1 : 1),
          isLikedByUser: !previousState?.isLikedByUser,
        };
      });

      return { previousState };
    },
    onError(error, variables, context) {
      console.log(error);
      queryClient.setQueryData<likeInfoProp>(queryKey, context?.previousState);

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
      <Heart
        className={`size-5 ${data.isLikedByUser && "fill-red-500 text-red-500"}`}
      />
      <span>
        {data.likes} <span className="hidden sm:inline">Likes</span>
      </span>
    </button>
  );
};

export default LikeButton;
