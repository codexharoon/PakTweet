import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import TrendsSidebar from "@/components/RightSidebar/TrendsSidebar";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { followerInfoProp, getUserSelectData, UserProp } from "@/lib/types";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPosts from "./UserPosts";

// fetching the user with the given username

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserSelectData(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

// Metadata is used to set the title of the page

export async function generateMetadata({
  params: { username },
}: {
  params: { username: string };
}): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${username})`,
  };
}

// main page

const Page = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser)
    return (
      <p className="text-destructive">
        You need to be logged in to view this page.
      </p>
    );

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />

        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s Posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>

      <TrendsSidebar />
    </main>
  );
};

export default Page;

// user profile

interface UserProfileProps {
  user: UserProp;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: followerInfoProp = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />

      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <div>
            <p>Member since {formatDate(user.createdAt, "MMM d yyyy")}</p>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Posts : <span className="font-semibold">{user._count.posts}</span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit Profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>

      {user.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
        </>
      )}
    </div>
  );
}
