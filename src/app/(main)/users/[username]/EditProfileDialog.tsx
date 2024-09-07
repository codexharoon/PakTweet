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
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import AvatarPlaceholder from "@/assets/avatar-placeholder.png";
import { Camera, Loader2 } from "lucide-react";
import CropImageDialog from "@/components/CropImageDialog";
import Resizer from "react-image-file-resizer";
import { useDebounceCallback } from "usehooks-ts";
import { kyInstance } from "@/lib/ky";

interface EditProfileDialogProps {
  user: UserProp;
  open: boolean;
  onClose: () => void;
}

const EditProfileDialog = ({ user, open, onClose }: EditProfileDialogProps) => {
  const [username, setUsername] = useState(user.username);
  const [usernameErrMsg, setUsernameErrMsg] = useState<string>("");
  const [findUsernameLoading, setFindUsernameLoading] =
    useState<boolean>(false);

  const debounced = useDebounceCallback(setUsername, 500);

  useEffect(() => {
    const findUsername = async () => {
      if (username) {
        setUsernameErrMsg("");
        setFindUsernameLoading(true);

        if (username === user.username) {
          setUsernameErrMsg("");
          setFindUsernameLoading(false);
          return;
        }

        try {
          const res: { message: string } = await kyInstance
            .get(`/api/users/username/${username}/find`)
            .json();

          setUsernameErrMsg(res.message);
        } catch (error) {
          setUsernameErrMsg("Username is not available");
        } finally {
          setFindUsernameLoading(false);
        }
      }
    };

    findUsername();
  }, [username, user.username]);

  const mutation = useUpdateUserProfileMutation();

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  const form = useForm<updateUserProfileSchemaType>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      username: user.username,
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });

  function onSubmit(values: updateUserProfileSchemaType) {
    const avatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;

    mutation.mutate(
      {
        values,
        avatar: avatarFile,
      },
      {
        onSuccess: () => {
          setCroppedAvatar(null);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="@username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>

                  {
                    <p className="text-xs">
                      {findUsernameLoading ? (
                        <Loader2 className="ml-3 mt-3 h-4 w-4 animate-spin" />
                      ) : usernameErrMsg === "username is available." ? (
                        <span className="ml-3 mt-2 text-green-500">
                          {usernameErrMsg}
                        </span>
                      ) : (
                        <span className="ml-3 mt-2 text-red-500">
                          {usernameErrMsg}
                        </span>
                      )}
                    </p>
                  }

                  <FormMessage />
                </FormItem>
              )}
            />

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
                Save
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

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
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

      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          aspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
