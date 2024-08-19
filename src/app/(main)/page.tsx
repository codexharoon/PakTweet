import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/RightSidebar/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Following from "./Following";

const Page = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />

        <Tabs defaultValue="for-you">
          <TabsList className="grid h-12 w-full grid-cols-2 bg-card">
            <TabsTrigger
              value="for-you"
              className="h-full hover:bg-background data-[state=active]:font-bold"
            >
              For You
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="h-full hover:bg-background data-[state=active]:font-bold"
            >
              Following
            </TabsTrigger>
          </TabsList>

          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>

          <TabsContent value="following">
            <Following />
          </TabsContent>
        </Tabs>
      </div>

      <TrendsSidebar />
    </main>
  );
};

export default Page;
