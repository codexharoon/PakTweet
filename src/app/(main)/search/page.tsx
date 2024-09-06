import TrendsSidebar from "@/components/RightSidebar/TrendsSidebar";
import SearchPage from "./SearchPage";

interface SearchProps {
  searchParams: { q: string };
}

export function generateMetadata({ searchParams: { q } }: SearchProps) {
  return {
    title: `Search results for "${q}"`,
  };
}

const page = ({ searchParams: { q } }: SearchProps) => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-2 break-words text-center text-2xl font-bold">
            {`Search results for "${q}"`}
          </h1>
        </div>
        <SearchPage query={q} />
      </div>

      <TrendsSidebar />
    </main>
  );
};

export default page;
