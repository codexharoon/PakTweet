import { Prisma } from "@prisma/client";

export function getUserSelectData(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
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
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserProp = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserSelectData>;
}>;

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserSelectData(loggedInUserId),
    },
    attachments: true,
  } satisfies Prisma.PostInclude;
}

export type PostProp = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostDataProp {
  posts: PostProp[];
  nextCursor: string | null;
}

export interface followerInfoProp {
  followers: number;
  isFollowedByUser: boolean;
}
