import { useToast } from "@/components/ui/use-toast";
import { updateUserProfileSchemaType } from "@/schema/zodValidation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateUserProfile } from "./actions";
import { useUploadThing } from "@/lib/uploadthing";
import { PostDataProp } from "@/lib/types";
import { useRouter } from "next/navigation";

export function useUpdateUserProfileMutation() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: updateUserProfileSchemaType;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),

        avatar && startAvatarUpload([avatar]),
      ]);
    },

    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

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
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || post.user.avatarUrl,
                    },
                  };
                }

                return post;
              }),
            })),
          };
        },
      );

      router.refresh();

      toast({
        description: "Profile updated!",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile",
      });
    },
  });

  return mutation;
}
