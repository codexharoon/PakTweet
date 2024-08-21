"use client";

import { Button } from "@/components/ui/button";
import { UserProp } from "@/lib/types";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";

interface EditProfileProps {
  user: UserProp;
}

const EditProfile = ({ user }: EditProfileProps) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button variant={"outline"} onClick={() => setShowDialog(true)}>
        Edit Profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};

export default EditProfile;
