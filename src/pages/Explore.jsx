import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { getTrendingNews, searchNews } from "../services/newsService";
import NewsDetail from "../components/Explore/NewsDetail";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [trends, setTrends] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  // Fetching trending news once
  useEffect(() => {
    (async () => {
      try {
        setTrends(await getTrendingNews());
      } catch (err) {
        console.error("Error fetching trending news:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setSearching(true);
        const data = await searchNews(searchQuery);
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const displayedNews = useMemo(
    () => (searchQuery.trim() ? results : trends),
    [searchQuery, results, trends]
  );

  const renderSkeleton = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="animate-pulse p-4 rounded-lg space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded w-1/4" />
        <div className="h-6 bg-gray-200 dark:bg-dark-bg-secondary rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded w-1/3" />
      </div>
    ));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-4">
            Explore
          </h1>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-dark-text-secondary" />
            <input
              type="text"
              placeholder="Search for news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-dark-bg-secondary rounded-full border-none outline-none focus:ring-2 focus:ring-twitter-blue text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-text-secondary"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4">
        {selectedNews ? (
          <NewsDetail
            news={selectedNews}
            onBack={() => setSelectedNews(null)}
          />
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-4">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : "What's happening"}
            </h2>

            {loading || searching ? (
              <div className="space-y-4">{renderSkeleton()}</div>
            ) : displayedNews.length > 0 ? (
              <div className="space-y-2">
                {displayedNews.map((trend, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedNews(trend)}
                    className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-secondary cursor-pointer transition-colors"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-dark-text mb-1">
                      {trend.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                      {Math.floor(Math.random() * 50) + 10}K Tweets
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-dark-text-secondary">
                No results found.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Explore;
