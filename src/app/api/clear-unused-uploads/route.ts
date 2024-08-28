import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        {
          message: "Unauthorized Header",
        },
        {
          status: 401,
        },
      );
    }

    const unUsedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    if (unUsedMedia.length === 0) {
      return Response.json(
        {
          message: "No unused media found",
        },
        {
          status: 404,
        },
      );
    }

    await new UTApi().deleteFiles(
      unUsedMedia.map(
        (media) =>
          media.url.split(
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
          )[1],
      ),
    );

    await prisma.media.deleteMany({
      where: {
        id: {
          in: unUsedMedia.map((media) => media.id),
        },
      },
    });

    return Response.json(
      {
        message: "Unused media cleared",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("clear-unused-uploads: ", error);
    return Response.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
