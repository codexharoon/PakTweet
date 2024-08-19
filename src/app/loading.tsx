import { Loader2 } from "lucide-react";

const loading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="mx-auto my-3 animate-spin" />;
    </div>
  );
};

export default loading;
