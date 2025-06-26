import { useState, useEffect } from 'react';
import TweetComposer from '../components/Tweet/TweetComposer';
import TweetList from '../components/Tweet/TweetList';
import { getTweets } from '../services/tweetService';

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getTweets((newTweets) => {
      setTweets(newTweets);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTweetCreated = () => {
    // The real-time listener will automatically update the tweets
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text">Home</h1>
        </div>
      </div>

      {/* Tweet Composer */}
      <TweetComposer onTweetCreated={handleTweetCreated} />

      {/* Tweets Feed */}
      <TweetList tweets={tweets} loading={loading} />
    </div>
  );
};

export default Home;