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

interface EditProfileDialogProps {
  user: UserProp;
  open: boolean;
  onClose: () => void;
}

const EditProfileDialog = ({ user, open, onClose }: EditProfileDialogProps) => {
  const mutation = useUpdateUserProfileMutation();

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
