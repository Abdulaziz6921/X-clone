const NewsDetail = ({ news, onBack }) => {
  if (!news) return null;

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-twitter-blue hover:underline"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Back to news</span>
      </button>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
        {news.title}
      </h2>
      <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
        Published: {new Date(news.publishedAt).toLocaleString()}
      </p>

      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          className="rounded-lg w-full max-h-[400px] object-cover"
        />
      )}

      <p className="text-gray-700 dark:text-dark-text mt-4">
        {news.content || news.description},
        {console.log(news.description, news.content)}
      </p>

      <a
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-twitter-blue underline mt-4 inline-block"
      >
        Read full article
      </a>
    </div>
  );
};

export default NewsDetail;
