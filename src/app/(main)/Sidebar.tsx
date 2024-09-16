"use server";

import { Button } from "@/components/ui/button";
import { Bookmark, Home } from "lucide-react";
import Link from "next/link";
import NotificationsButton from "./NotificationsButton";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import MesagesButton from "./MesagesButton";
import streamServerClient from "@/lib/stream";

interface SidebarProps {
  className?: string;
}

export default async function Sidebar({ className }: SidebarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const [notificationCount, total_unread_count] = await Promise.all([
    await prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),

    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      <Button
        variant={"ghost"}
        title="Home"
        className="flex items-center justify-start gap-3"
        asChild
      >
        <Link href={"/"}>
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <NotificationsButton initialState={{ unreadCount: notificationCount }} />

      <MesagesButton initialState={{ unreadCount: total_unread_count }} />

      <Button
        variant={"ghost"}
        title="Bookmarks"
        className="flex items-center justify-start gap-3"
        asChild
      >
        <Link href={"/bookmarks"}>
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
