"use client";

import { Button } from "@/components/ui/button";
import { kyInstance } from "@/lib/ky";
import { MessagesCountInfoProp } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import Link from "next/link";

interface MessagesButtonProps {
  initialState: MessagesCountInfoProp;
}

const MesagesButton = ({ initialState }: MessagesButtonProps) => {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: async () =>
      await kyInstance
        .get("/api/messages/unread-count")
        .json<MessagesCountInfoProp>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant={"ghost"}
      title="Messages"
      className="flex items-center justify-start gap-3"
      asChild
    >
      <Link href={"/messages"}>
        <div className="relative">
          <Mail />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
};

export default MesagesButton;
