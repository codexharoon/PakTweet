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
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export type PostProp = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserSelectData(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentProp = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface PostDataProp {
  posts: PostProp[];
  nextCursor: string | null;
}

export interface followerInfoProp {
  followers: number;
  isFollowedByUser: boolean;
}

export interface likeInfoProp {
  likes: number;
  isLikedByUser: boolean;
}

export interface bookmarkInfoProp {
  isBookmarkedByUser: boolean;
}

export interface CommentDataProp {
  comments: CommentProp[];
  previousCursor: string | null;
}
