import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { userSelectData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";

const TrendsSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
      </Suspense>
    </div>
  );
};

export default TrendsSidebar;

async function WhoToFollow() {
  const { user } = await validateRequest();

  // artifically slow down the response
  //   await new Promise((r) => setTimeout(r, 10000));

  if (!user) return null;

  const userToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
    },
    select: userSelectData,
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

          <Button>Follow</Button>
        </div>
      ))}
    </div>
  );
}
