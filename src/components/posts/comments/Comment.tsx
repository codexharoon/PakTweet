"use client";

import Linkify from "@/components/Linkify";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import { CommentProp } from "@/lib/types";
import { formatRelativeData } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/app/(main)/SessionProvider";
import CommentMoreButton from "./CommentsMoreButton";

const Comment = ({ comment }: { comment: CommentProp }) => {
  const { user } = useSession();

  return (
    <div className="group/comment flex items-center gap-3 py-3">
      <span className="">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} />
          </Link>
        </UserTooltip>
      </span>

      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>

          <span className="text-xs text-muted-foreground">
            {formatRelativeData(comment.createdAt)}
          </span>
        </div>

        <div>
          <Linkify>{comment.content}</Linkify>
        </div>
      </div>
      {user.id === comment.user.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
};

export default Comment;
