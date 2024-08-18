import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "../UserAvatar";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "../FollowButton";
import { getUserSelectData } from "@/lib/types";

const TrendsSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
};

export default TrendsSidebar;

async function WhoToFollow() {
  const { user: loggedInUser } = await validateRequest();

  // artifically slow down the response
  //   await new Promise((r) => setTimeout(r, 10000));

  if (!loggedInUser) return null;

  const userToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: loggedInUser.id,
      },
      followers: {
        none: {
          followerId: loggedInUser.id,
        },
      },
    },
    select: getUserSelectData(loggedInUser.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {userToFollow.map((user, index) => (
        <div
          key={`${index}-${user.username}`}
          className="flex items-center justify-between gap-5"
        >
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

          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === loggedInUser.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    // const result = await prisma.$queryRaw<{}[]>``;
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+','g'))) AS hashtag, COUNT(*) AS count FROM posts 
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC 
            LIMIT 5
        `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map((topic) => {
        const title = topic.hashtag.split("#")[1];

        return (
          <Link className="block" href={`/hashtags/${title}`} key={title}>
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={topic.hashtag}
            >
              {topic.hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(topic.count)} {topic.count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
