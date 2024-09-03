import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getNotificationsDataInclude, NotificationDataProp } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const pageSize = 10;

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: getNotificationsDataInclude(),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      notifications.length > pageSize ? notifications[pageSize].id : null;

    const data: NotificationDataProp = {
      notifications: notifications.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log("Notification Get: ", error);
    return Response.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
