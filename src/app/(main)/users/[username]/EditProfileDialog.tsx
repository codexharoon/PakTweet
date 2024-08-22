import { UserProp } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUserProfileMutation } from "./mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  updateUserProfileSchema,
  updateUserProfileSchemaType,
} from "@/schema/zodValidation";
import LoadingButton from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import AvatarPlaceholder from "@/assets/avatar-placeholder.png";
import { Camera } from "lucide-react";

interface EditProfileDialogProps {
  user: UserProp;
  open: boolean;
  onClose: () => void;
}

const EditProfileDialog = ({ user, open, onClose }: EditProfileDialogProps) => {
  const mutation = useUpdateUserProfileMutation();

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  const form = useForm<updateUserProfileSchemaType>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });

  function onSubmit(values: updateUserProfileSchemaType) {
    mutation.mutate(
      {
        values,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  }

  function handleOpenChange(open: boolean) {
    if (!open && !mutation.isPending) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <AvatarInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.avatarUrl || AvatarPlaceholder
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your fullname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton loading={mutation.isPending} type="submit">
                Update
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;

// avatar input

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const inputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    //
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        className="sr-only hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative block"
      >
        <Image
          src={src}
          alt="avatar preview/change"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />

        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black/50 transition-colors duration-200 group-hover:bg-black/30">
          <Camera size={24} />
        </span>
      </button>
    </>
  );
}
