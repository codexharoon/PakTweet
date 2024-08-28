import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserProp } from "@/lib/types";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import Post from "@/components/posts/Post";
import UserTooltip from "@/components/UserTooltip";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import { Loader2 } from "lucide-react";
import FollowButton from "@/components/FollowButton";
import Linkify from "@/components/Linkify";

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});

// for metadata | change the title of the page

export async function generateMetadata({
  params: { postId },
}: {
  params: { postId: string };
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const post = await getPost(postId, user.id);
  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 15)}...`,
  };
}

// main page

const Page = async ({ params: { postId } }: { params: { postId: string } }) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser)
    return (
      <p className="text-destructive">
        You need to be logged in to view this page.
      </p>
    );

  const post = await getPost(postId, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>

      <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
};

export default Page;

// side bar

interface UserInfoSidebar {
  user: UserProp;
}

async function UserInfoSidebar({ user }: UserInfoSidebar) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) throw new Error("Unauthorized");

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>

      <div className="flex items-center justify-between gap-5">
        <UserTooltip user={user}>
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={user.avatarUrl} />

            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
        </UserTooltip>

        {loggedInUser.id !== user.id && (
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === loggedInUser.id,
              ),
            }}
          />
        )}
      </div>

      {user.bio && (
        <Linkify>
          <p className="line-clamp-6 overflow-hidden whitespace-pre-line break-words text-muted-foreground">
            {user.bio}
          </p>
        </Linkify>
      )}
    </div>
  );
}
