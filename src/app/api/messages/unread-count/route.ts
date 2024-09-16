import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";
import { MessagesCountInfoProp } from "@/lib/types";

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

    const { total_unread_count } = await streamServerClient.getUnreadCount(
      user.id,
    );

    const data: MessagesCountInfoProp = {
      unreadCount: total_unread_count,
    };

    return Response.json({
      data,
    });
  } catch (error) {
    console.log("Messages count Get: ", error);
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
