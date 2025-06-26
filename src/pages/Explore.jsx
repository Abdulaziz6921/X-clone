import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getTrendingNews, searchNews } from "../services/newsService";
import NewsDetail from "../components/Explore/NewsDetail";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [trends, setTrends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const news = await getTrendingNews();
        setTrends(news);
      } catch (error) {
        console.error("Error fetching trending news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);
  console.log(trends);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setSearching(true);
        searchNews(searchQuery)
          .then(setSearchResults)
          .catch((err) => console.error("Search failed:", err))
          .finally(() => setSearching(false));
      } else {
        setSearchResults([]);
      }
    }, 500); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const displayedNews = searchQuery.trim() ? searchResults : trends;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-4">
            Explore
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-dark-text-secondary" />
            <input
              type="text"
              placeholder="Search for news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-dark-bg-secondary rounded-full border-none outline-none focus:ring-2 focus:ring-twitter-blue text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-text-secondary"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
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
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="animate-pulse p-4 rounded-lg">
                    <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-dark-bg-secondary rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {displayedNews.length > 0 ? (
                  displayedNews.map((trend, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedNews(trend)}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-dark-bg-secondary rounded-lg cursor-pointer transition-colors"
                    >
                      <h3 className="font-bold text-gray-900 dark:text-dark-text mb-1">
                        {trend.title}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                        {Math.floor(Math.random() * 50) + 10}K Tweets
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-dark-text-secondary">
                    No results found.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
