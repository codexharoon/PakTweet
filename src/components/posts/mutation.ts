import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { deletePost } from "./actions";
import { PostDataProp } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";

export default function useDeletePostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathName = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletePost) => {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostDataProp, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletePost.id),
            })),
          };
        },
      );

      toast({
        description: "Post deleted successfully.",
      });

      if (pathName === `/posts/${deletePost.id}`) {
        router.push("/");
      }
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description:
          "An error occurred while deleting the post. Please try again later.",
      });
    },
  });

  return { mutation };
}
