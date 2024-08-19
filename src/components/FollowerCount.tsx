"use client";

import useFollowerInfo from "@/app/hooks/useFollowerInfo";
import { followerInfoProp } from "@/lib/types";

interface FollowerCountProps {
  userId: string;
  initialState: followerInfoProp;
}

const FollowerCount = ({ initialState, userId }: FollowerCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span>
      Followers : <span className="font-semibold">{data.followers}</span>
    </span>
  );
};

export default FollowerCount;
