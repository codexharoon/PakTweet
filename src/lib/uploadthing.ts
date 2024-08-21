import { generateReactHelpers } from "@uploadthing/react";

import type { fileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<fileRouter>();
