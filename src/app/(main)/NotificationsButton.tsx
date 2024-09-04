"use client";

import { Button } from "@/components/ui/button";
import { kyInstance } from "@/lib/ky";
import { NotificationCountInfoProp } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Bell, Link } from "lucide-react";

interface NotificationButtonProps {
  initialState: NotificationCountInfoProp;
}

const NotificationsButton = ({ initialState }: NotificationButtonProps) => {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfoProp>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant={"ghost"}
      title="Notifications"
      className="flex items-center justify-start gap-3"
      asChild
    >
      <Link href={"/notifications"}>
        <div className="relative">
          <Bell />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
};

export default NotificationsButton;
