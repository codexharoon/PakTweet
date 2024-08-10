import PostEditor from "@/components/posts/editor/PostEditor";
import React from "react";

const Page = () => {
  return (
    <main className="h-[200vh] w-full bg-black/80 p-5">
      <div className="w-full">
        <PostEditor />
      </div>
    </main>
  );
};

export default Page;
