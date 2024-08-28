import { FileQuestion } from "lucide-react";

const NotFound = () => {
  return (
    <main className="my-12 w-full space-y-3 text-center">
      <div className="flex items-center justify-center">
        <FileQuestion className="size-10" />
      </div>
      <h1 className="text-3xl font-bold">Not Found</h1>
      <p>The post you are looking for does not exist.</p>
    </main>
  );
};

export default NotFound;
