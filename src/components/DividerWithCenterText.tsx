import { PropsWithChildren } from "react";

const DividerWithCenterText = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-muted"></div>
      <span>{children}</span>
      <div className="h-px flex-1 bg-muted"></div>
    </div>
  );
};

export default DividerWithCenterText;
