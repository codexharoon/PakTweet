import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "./ui/button";

interface CropImageDialogProps {
  src: string;
  aspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}

const CropImageDialog = ({
  src,
  aspectRatio,
  onCropped,
  onClose,
}: CropImageDialogProps) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <Cropper
          src={src}
          className="mx-auto size-fit"
          aspectRatio={aspectRatio}
          zoomable={false}
          guides={false}
          ref={cropperRef}
        />

        <DialogFooter>
          <Button onClick={onClose} variant={"secondary"}>
            Cancel
          </Button>
          <Button onClick={onCrop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropImageDialog;
