import { kyInstance } from "@/lib/ky";
import { followerInfoProp } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  initialState: followerInfoProp,
) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/follower`).json<followerInfoProp>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
