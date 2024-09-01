"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, PostProp } from "@/lib/types";
import { commentSchema } from "@/schema/zodValidation";

export async function postComment({
  post,
  content,
}: {
  post: PostProp;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const validateContent = commentSchema.safeParse({ content });

  if (!validateContent.success) {
    throw new Error(validateContent.error.errors[0].message);
  }

  const { content: validatedContent } = validateContent.data;

  const newComment = await prisma.comment.create({
    data: {
      content: validatedContent,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentDataInclude(user.id),
  });

  return newComment;
}
