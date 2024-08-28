"use client";

import { followerInfoProp, UserProp } from "@/lib/types";
import { PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/app/(main)/SessionProvider";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";
import Linkify from "./Linkify";
import FollowerCount from "./FollowerCount";

interface UserTooltipProps extends PropsWithChildren {
  user: UserProp;
}

const UserTooltip = ({ user, children }: UserTooltipProps) => {
  const { user: loggedInUser } = useSession();

  const followerInfo: followerInfoProp = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-60">
            <div className="flex items-center justify-between gap-3">
              <Link href={`/users/${user.username}`}>
                <UserAvatar avatarUrl={user.avatarUrl} size={70} />
              </Link>

              {user.id !== loggedInUser.id && (
                <FollowButton userId={user.id} initialState={followerInfo} />
              )}
            </div>

            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>

            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}

            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserTooltip;
