import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { useSession } from "../SessionProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MailPlus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import NewChatDialog from "./NewChatDialog";
import { useQueryClient } from "@tanstack/react-query";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

const ChatSidebar = ({ open, onClose }: ChatSidebarProps) => {
  const { user } = useSession();

  const queryClient = useQueryClient();
  const { channel } = useChatContext();

  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
    }
  }, [channel?.id, queryClient]);

  const CustomChannelPreview = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props?.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose],
  );

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />

      <ChannelList
        filters={{ type: "messaging", members: { $in: [user.id] } }}
        showChannelSearch
        options={{
          state: true,
          presence: true,
          limit: 8,
        }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                members: { $in: [user.id] },
              },
            },
          },
        }}
        Preview={CustomChannelPreview}
      />
    </div>
  );
};

export default ChatSidebar;

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);

  return (
    <div className="flex items-center justify-center gap-3 p-2">
      <div className="h-full md:hidden">
        <Button onClick={onClose} variant={"ghost"} size={"icon"}>
          <X className="size-5" />
        </Button>
      </div>

      <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>

      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => setOpenNewChatDialog(true)}
        title="Create New Chat"
      >
        <MailPlus className="size-5" />
      </Button>

      {openNewChatDialog && (
        <NewChatDialog
          handleOpenChange={setOpenNewChatDialog}
          onChatCreated={() => {
            setOpenNewChatDialog(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}
