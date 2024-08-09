import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
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

      <Button
        variant={"ghost"}
        title="Notifications"
        className="flex items-center justify-start gap-3"
        asChild
      >
        <Link href={"/notifications"}>
          <Bell />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>

      <Button
        variant={"ghost"}
        title="Messages"
        className="flex items-center justify-start gap-3"
        asChild
      >
        <Link href={"/messages"}>
          <Mail />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>

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
};

export default Sidebar;
