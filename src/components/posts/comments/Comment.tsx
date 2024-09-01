import Linkify from "@/components/Linkify";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import { CommentProp } from "@/lib/types";
import { formatRelativeData } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Comment = ({ comment }: { comment: CommentProp }) => {
  return (
    <div className="flex items-center gap-3 py-3">
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
    </div>
  );
};

export default Comment;
