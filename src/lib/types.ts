import { Prisma } from "@prisma/client";

export function getUserSelectData(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserSelectData(loggedInUserId),
    },
  } satisfies Prisma.PostInclude;
}

export type PostProp = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface forYouRouteDataProp {
  posts: PostProp[];
  nextCursor: string | null;
}

export interface followerInfoProp {
  followers: number;
  isFollowedByUser: boolean;
}
