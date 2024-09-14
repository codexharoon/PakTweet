import useDebounce from "@/app/hooks/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UserResponse } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import { useSession } from "../SessionProvider";

interface NewChatDialogProps {
  handleOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
}

const NewChatDialog = ({
  handleOpenChange,
  onChatCreated,
}: NewChatDialogProps) => {
  const { client, channel } = useChatContext();

  const { user: loggedInUser } = useSession();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput);

  const [selectedUsers, setselectedUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);

  const {} = useQuery({
    queryKey: ["stream-users", debouncedSearchInput],
    queryFn: async () =>
      client.queryUsers(
        {
          id: { $ne: loggedInUser.id },
          role: { $ne: "admin" },
          ...(debouncedSearchInput
            ? {
                $or: [
                  { name: { $autocomplete: debouncedSearchInput } },
                  { username: { $autocomplete: debouncedSearchInput } },
                ],
              }
            : {}),
        },
        { username: 1, name: 1 },
        { limit: 10 },
      ),
  });

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
