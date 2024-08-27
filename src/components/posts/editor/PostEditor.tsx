"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import "./style.css";
import useSubmitPostMutation from "./mutations";
import LoadingButton from "@/components/ui/loading-button";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const PostEditor = () => {
  const { user } = useSession();

  const { mutation } = useSubmitPostMutation();

  const {
    attachments,
    removeAttachment,
    startUpload,
    isUploading,
    uploadProgrss,
    reset: resetMediaUpload,
  } = useMediaUpload();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's on your mind?",
      }),
    ],
  });

  const inputContent =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function submit() {
    if (!inputContent) return;

    mutation.mutate(
      {
        content: inputContent,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUpload();
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>

      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          onRemove={removeAttachment}
        />
      )}

      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            {/* <progress
              value={uploadProgrss}
              max={100}
              className="h-1 w-full rounded-2xl bg-primary"
            /> */}
            <span className="text-sm">{uploadProgrss ?? 0}%</span>
            <Loader2 size={5} className="size-5 animate-spin text-primary" />
          </>
        )}

        <AddAttachmentButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />

        <LoadingButton
          loading={mutation.isPending}
          onClick={submit}
          disabled={!inputContent.trim() || isUploading}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
};

export default PostEditor;

interface AddAttachmentButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

function AddAttachmentButton({
  onFilesSelected,
  disabled,
}: AddAttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        accept="image/*,video/*"
        multiple
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          onFilesSelected(files);
          e.target.value = "";
        }}
      />

      <Button
        variant={"ghost"}
        size={"icon"}
        disabled={disabled}
        className="hover:text-primary-dark text-primary"
        onClick={() => inputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
    </>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove: () => void;
}

function AttachmentPreview({
  attachment: { file, isUploading },
  onRemove,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}

      {!isUploading && (
        <button
          onClick={onRemove}
          disabled={isUploading}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  onRemove: (filename: string) => void;
}

function AttachmentPreviews({
  attachments,
  onRemove,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemove={() => onRemove(attachment.file.name)}
        />
      ))}
    </div>
  );
}
