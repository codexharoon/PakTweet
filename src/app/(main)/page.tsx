import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/RightSidebar/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";

const Page = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>

      <TrendsSidebar />
    </main>
  );
};

export default Page;
