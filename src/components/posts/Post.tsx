"use client";

import { PostProp } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { cn, formatRelativeData } from "@/lib/utils";
import PostMoreButton from "./PostMoreButton";
import { useSession } from "@/app/(main)/SessionProvider";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import { Media } from "@prisma/client";
import Image from "next/image";

interface PostProps {
  post: PostProp;
}

const Post = ({ post }: PostProps) => {
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>

          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>

            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeData(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.userId === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>

      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>

      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
    </article>
  );
};

export default Post;

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div className={cn(attachments.length > 1 && "grid grid-cols-2 gap-3")}>
      {attachments.map((attachment) => (
        <MediaPreview key={attachment.id} attachment={attachment} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  attachment: Media;
}

function MediaPreview({ attachment }: MediaPreviewProps) {
  if (attachment.type === "IMAGE") {
    return (
      <Image
        src={attachment.url}
        width={500}
        height={500}
        alt="media attachment with post"
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (attachment.type === "VIDEO") {
    return (
      <div>
        <video controls className="mx-auto size-fit max-h-[30rem] rounded-2xl">
          <source src={attachment.url} />
        </video>
      </div>
    );
  }

  return (
    <p className="mx-auto text-center text-destructive">
      Unsupported Media Type.
    </p>
  );
}
