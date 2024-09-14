import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

interface ChatChannelProps {
  open: boolean;
  onClose: () => void;
}

const ChatChannel = ({ open, onClose }: ChatChannelProps) => {
  return (
    <div className={cn("w-full md:block", !open && "hidden")}>
      <Channel>
        <Window>
          <CustomChannelHeader onClose={onClose} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
};

export default ChatChannel;

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  onClose: () => void;
}

function CustomChannelHeader({ onClose, ...props }: CustomChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className="md:hidden">
        <Button onClick={onClose} variant={"ghost"} size={"icon"}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}
