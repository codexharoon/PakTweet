"use client";

import { Loader2 } from "lucide-react";
import useInitilizeChatClient from "./useInitilizeChatClient";
import { Chat as StreamChat } from "stream-chat-react";
import ChatSidebar from "./ChatSidebar";
import ChatChannel from "./ChatChannel";
import { useTheme } from "next-themes";
import { useState } from "react";

const Chat = () => {
  const client = useInitilizeChatClient();
  const { resolvedTheme } = useTheme();

  const [open, setOpen] = useState(false);

  if (!client) return <Loader2 className="mx-auto animate-spin" />;

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={client}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSidebar open={open} onClose={() => setOpen(false)} />
          <ChatChannel open={!open} onClose={() => setOpen(true)} />
        </StreamChat>
      </div>
    </main>
  );
};

export default Chat;
