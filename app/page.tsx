import { fetchAllFeeds } from "@/lib/fetch-feeds";
import { SOURCES } from "@/lib/sources";
import Feed from "@/components/feed";

// Revalidate every 15 minutes
export const revalidate = 900;

export default async function HomePage() {
  const articles = await fetchAllFeeds();
  const lastUpdated = new Date().toISOString();

  return (
    <Feed
      articles={articles}
      sourceCount={SOURCES.length}
      lastUpdated={lastUpdated}
    />
  );
}
