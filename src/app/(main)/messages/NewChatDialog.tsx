import useDebounce from "@/app/hooks/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UserResponse } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import { useSession } from "../SessionProvider";
import { Check, Loader2, SearchIcon, X } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { useToast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/ui/loading-button";

interface NewChatDialogProps {
  handleOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
}

const NewChatDialog = ({
  handleOpenChange,
  onChatCreated,
}: NewChatDialogProps) => {
  const { client, setActiveChannel } = useChatContext();

  const { toast } = useToast();

  const { user: loggedInUser } = useSession();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput);

  const [selectedUsers, setselectedUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);

  const { data, isSuccess, isFetching, isError } = useQuery({
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

  const mutation = useMutation({
    mutationFn: async () => {
      const channel = client.channel("messaging", {
        members: [loggedInUser.id, ...selectedUsers.map((user) => user.id)],
        name:
          selectedUsers.length > 1
            ? loggedInUser.displayName +
              ", " +
              selectedUsers.map((user) => user.name).join(", ")
            : undefined,
      });

      await channel.create();

      return channel;
    },
    onSuccess: (channel) => {
      setActiveChannel(channel);
      onChatCreated();
    },
    onError(error) {
      console.log("error to create group chat: ", error);
      toast({
        variant: "destructive",
        description: "An error occurred while creating the chat.",
      });
    },
  });

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>

        <div>
          <div className="group relative">
            <SearchIcon className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="search user..."
              className="h-12 w-full pe-4 ps-14 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <hr />

          <div className="mt-4 flex flex-wrap items-center gap-2 p-2">
            {!!selectedUsers.length &&
              selectedUsers.map((user) => (
                <SelectedUserTag
                  key={user.id}
                  user={user}
                  onRemove={() =>
                    setselectedUsers((prev) =>
                      prev.filter((u) => u.id !== user.id),
                    )
                  }
                />
              ))}
          </div>

          <div className="h-96 overflow-y-auto">
            {isFetching && (
              <Loader2 className="mx-auto my-3 animate-spin text-primary" />
            )}

            {isSuccess && !data.users.length && !isFetching && (
              <p className="text-center text-muted-foreground">
                No users found. Try searching with a different name.
              </p>
            )}

            {isSuccess &&
              data.users.map((user) => (
                <UserResult
                  key={user.id}
                  user={user}
                  selected={selectedUsers.some((u) => u.id === user.id)}
                  onClick={() =>
                    setselectedUsers((prev) =>
                      prev.some((u) => u.id === user.id)
                        ? prev.filter((u) => u.id !== user.id)
                        : [...prev, user],
                    )
                  }
                />
              ))}

            {isError && (
              <p className="text-center text-destructive">
                An error occurred while fetching users.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 pb-6">
          <LoadingButton
            loading={mutation.isPending}
            disabled={!selectedUsers.length}
            onClick={() => mutation.mutate()}
          >
            Start Chat
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;

// user result card

interface UserResultProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  selected: boolean;
  onClick: () => void;
}

function UserResult({ user, selected, onClick }: UserResultProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-2">
        <UserAvatar avatarUrl={user?.image!} />

        <div className="flex flex-col text-start">
          <p className="font-bold">{user.name}</p>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      {selected && <Check className="size-5 text-green-500" />}
    </button>
  );
}

// selected user tag

interface SelectedUserTagProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  onRemove: () => void;
}

function SelectedUserTag({ user, onRemove }: SelectedUserTagProps) {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50"
    >
      <UserAvatar avatarUrl={user?.image!} size={24} />
      <p className="font-bold">{user.name}</p>
      <X className="mx-2 size-5 text-muted-foreground" />
    </button>
  );
}
