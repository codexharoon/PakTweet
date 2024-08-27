import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgrss, setUploadProgress] = useState<number>();

  const { isUploading, startUpload } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment-${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          },
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({
          file,
          isUploading: true,
        })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);

          if (!uploadResult) return a;

          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));

      toast({
        variant: "destructive",
        description: e.message,
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Another upload is in progress. Please wait.",
      });
      return;
    }

    if (files.length + attachments.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload up to 5 files at a time.",
      });
      return;
    }

    startUpload(files);
  }

  function removeAttachment(filename: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== filename));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    attachments,
    isUploading,
    uploadProgrss,
    startUpload: handleStartUpload,
    removeAttachment,
    reset,
  };
}
