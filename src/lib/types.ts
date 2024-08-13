import { Prisma } from "@prisma/client";

export const userSelectData = {
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export const postDataInclude = {
  user: {
    select: userSelectData,
  },
} satisfies Prisma.PostInclude;

export type PostProp = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;
