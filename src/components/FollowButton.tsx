"use client";

import { followerInfoProp } from "@/lib/types";
import React from "react";
import { Button } from "./ui/button";
import useFollowerInfo from "@/app/hooks/useFollowerInfo";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { kyInstance } from "@/lib/ky";
import { useToast } from "./ui/use-toast";

interface FollowButtonProps {
  userId: string;
  initialState: followerInfoProp;
}

const FollowButton = ({ userId, initialState }: FollowButtonProps) => {
  const { data } = useFollowerInfo(userId, initialState);

  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/follower`)
        : kyInstance.post(`/api/users/${userId}/follower`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState =
        queryClient.getQueryData<followerInfoProp>(queryKey);

      queryClient.setQueryData<followerInfoProp>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      console.log(error);

      queryClient.setQueryData<followerInfoProp>(
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
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutation.mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
