import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NotificationCountInfoProp } from "@/lib/types";

export async function GET() {
  try {
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

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    });

    const data: NotificationCountInfoProp = {
      unreadCount,
    };

    return Response.json({
      data,
    });
  } catch (error) {
    console.log("Notification count Get: ", error);
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
