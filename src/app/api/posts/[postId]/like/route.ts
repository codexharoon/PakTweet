import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { likeInfoProp } from "@/lib/types";

export async function GET(
  req: Request,
  {
    params: { postId },
  }: {
    params: { postId: string };
  },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const data: likeInfoProp = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  {
    params: { postId },
  }: {
    params: { postId: string };
  },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.like.upsert({
        where: {
          userId_postId: {
            userId: loggedInUser.id,
            postId: postId,
          },
        },
        create: {
          userId: loggedInUser.id,
          postId: postId,
        },
        update: {},
      }),

      ...(post.userId !== loggedInUser.id
        ? [
            prisma.notification.create({
              data: {
                issuerId: loggedInUser.id,
                recipientId: post.userId,
                postId: postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { postId },
  }: {
    params: { postId: string };
  },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: loggedInUser.id,
          postId: postId,
        },
      }),

      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          postId: postId,
          type: "LIKE",
        },
      }),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
