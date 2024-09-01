import Linkify from "@/components/Linkify";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import { CommentProp } from "@/lib/types";
import React from "react";

const Comment = ({ comment }: { comment: CommentProp }) => {
  return (
    <div key={comment.id} className="flex items-center space-x-2 p-3">
      <UserTooltip user={comment.user}>
        <UserAvatar avatarUrl={comment.user.avatarUrl} />
      </UserTooltip>
      <div>
        <p className="font-semibold">{comment.user.displayName}</p>
        <p>
          <Linkify>{comment.content}</Linkify>
        </p>
      </div>
    </div>
  );
};

export default Comment;
