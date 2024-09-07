import UserAvatar from "@/components/UserAvatar";
import { NotificationProp } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { Bookmark, Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";

interface NotificationProps {
  notification: NotificationProp;
}

const Notification = ({ notification }: NotificationProps) => {
  const NotificationTypeMap: Record<
    NotificationType,
    { message: string; icon: React.JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.displayName} started following you.`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    LIKE: {
      message: `${notification.issuer.displayName} liked your post.`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: `/posts/${notification.postId}`,
    },
    COMMENT: {
      message: `${notification.issuer.displayName} commented on your post.`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      href: `/posts/${notification.postId}`,
    },
    BOOKMARK: {
      message: `${notification.issuer.displayName} bookmarked your post.`,
      icon: <Bookmark className="size-7 fill-primary text-primary" />,
      href: `/posts/${notification.postId}`,
    },
  };

  const { message, icon, href } = NotificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-3 shadow-sm transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
            <span className="font-bold">
              {notification.issuer.displayName}
            </span>{" "}
          </div>

          <div>
            <span>{message}</span>
          </div>

          {notification.post && (
            <div className="line-clamp-2 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default Notification;
