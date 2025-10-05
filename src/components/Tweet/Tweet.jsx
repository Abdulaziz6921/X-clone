import { useState, useMemo, useCallback, memo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { likeTweet, retweetTweet } from "../../services/tweetService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReplyModal from "./ReplyModal";
import { useUserCache } from "../../hooks/useUserCache";
import { formatRelativeTime, formatTime } from "../../utils/time";
import { formatNumber } from "../../utils/number";
import VerifiedBadge from "./VerifiedBadge";
import MediaRenderer from "./MediaRenderer";

dayjs.extend(relativeTime);

const Tweet = ({
  tweet,
  isParent,
  isRepliesTab,
  isReplyModal,
  hideMedia,
  isReply,
  isTweetDetail,
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserCache(tweet.userId);

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [liked, setLiked] = useState(
    tweet?.likedBy?.includes(currentUser?.uid) || false
  );
  const [retweeted, setRetweeted] = useState(
    tweet?.retweetedBy?.includes(currentUser?.uid) || false
  );
  const [likesCount, setLikesCount] = useState(tweet.likesCount || 0);
  const [retweetsCount, setRetweetsCount] = useState(tweet.retweetsCount || 0);
  const [isProcessing, setIsProcessing] = useState({
    like: false,
    retweet: false,
  });

  const safeNavigate = useCallback(
    (to) => {
      if (location.pathname !== to) {
        navigate(to);
      }
    },
    [location.pathname, navigate]
  );

  const formattedTime = useMemo(
    () => formatRelativeTime(tweet.createdAt),
    [tweet.createdAt]
  );
  const formattedScheduledTime = useMemo(
    () => tweet.scheduledAt && formatTime(tweet.scheduledAt),
    [tweet.scheduledAt]
  );

  const handleLike = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isProcessing.like || !currentUser?.uid) return;

      setIsProcessing((prev) => ({ ...prev, like: true }));
      const newLikedState = !liked;

      try {
        await likeTweet(tweet.id, currentUser.uid);
        setLiked(newLikedState);
        setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));
      } catch (err) {
        console.error("Like failed:", err);
      } finally {
        setIsProcessing((prev) => ({ ...prev, like: false }));
      }
    },
    [isProcessing.like, liked, currentUser?.uid, tweet.id]
  );

  const handleRetweet = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isProcessing.retweet || !currentUser?.uid) return;

      setIsProcessing((prev) => ({ ...prev, retweet: true }));
      const newRetweetState = !retweeted;

      try {
        await retweetTweet(tweet.id, currentUser.uid);
        setRetweeted(newRetweetState);
        setRetweetsCount((prev) => (newRetweetState ? prev + 1 : prev - 1));
      } catch (err) {
        console.error("Retweet failed:", err);
      } finally {
        setIsProcessing((prev) => ({ ...prev, retweet: false }));
      }
    },
    [isProcessing.retweet, retweeted, currentUser?.uid, tweet.id]
  );

  const handleReplyClick = useCallback((e) => {
    e.stopPropagation();
    setShowReplyModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowReplyModal(false);
  }, []);

  const stopPropagation = (e) => e.stopPropagation();

  const tweetClass = useMemo(
    () =>
      `${
        isReplyModal || isTweetDetail || isParent || isRepliesTab
          ? ""
          : "p-2 md:p-4 border-b border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg-secondary transition-colors cursor-pointer"
      }`,
    [isReplyModal, isTweetDetail, isParent, isRepliesTab]
  );

  return (
    <article
      onClick={() => safeNavigate(`/tweet/${tweet.id}`)}
      className={tweetClass}
    >
      <div className="flex gap-2 md:gap-3">
        <Link
          to={`/profile/${tweet.username}`}
          onClick={stopPropagation}
          className="w-9 h-9 md:w-12 md:h-12 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-white font-semibold">
              {user?.displayName?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0 ">
          <div
            className={`flex items-center justify-between ${
              isReplyModal ? "" : "mb-1"
            }`}
          >
            <div className="flex space-x-2">
              {!isRepliesTab && (
                <Link
                  to={`/profile/${tweet.username}`}
                  onClick={stopPropagation}
                  className="font-semibold text-gray-900 dark:text-dark-text truncate hover:underline"
                >
                  {tweet.displayName}
                </Link>
              )}
              {tweet.verified && <VerifiedBadge />}
              <Link
                to={`/profile/${tweet.username}`}
                onClick={stopPropagation}
                className="text-gray-500 dark:text-dark-text-secondary"
              >
                @{tweet.username}
              </Link>
              <span className="text-gray-500 dark:text-dark-text-secondary">
                ·
              </span>
              <span className="text-gray-500 dark:text-dark-text-secondary">
                {formattedTime}
              </span>
            </div>
            {!isReplyModal && (
              <div className="ml-auto">
                <button
                  onClick={stopPropagation}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
                >
                  <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-dark-text-secondary" />
                </button>
              </div>
            )}
          </div>

          {isRepliesTab && tweet.replyToUsername && (
            <div className="text-sm text-gray-500 dark:text-dark-text-secondary mb-1">
              Replying to{" "}
              <Link
                to={`/profile/${tweet.replyToUsername}`}
                className="text-twitter-blue hover:underline"
              >
                @{tweet.replyToUsername}
              </Link>
            </div>
          )}

          <p
            className={`text-gray-900 dark:text-dark-text ${
              isReplyModal ? "" : "mb-3"
            } whitespace-pre-wrap break-all text-md ${
              isRepliesTab ? "opacity-90" : ""
            }`}
          >
            {tweet.content}
          </p>

          {!hideMedia && tweet.mediaUrls?.length > 0 && (
            <MediaRenderer mediaUrls={tweet.mediaUrls} />
          )}

          {!isReplyModal && (
            <div className="flex gap-3 md:gap-5 flex-col mb-3 md:flex-row">
              {tweet.scheduledAt && (
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
                  📅 {formattedScheduledTime}
                </p>
              )}
              {tweet.location && (
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
                  📍 {tweet.location}
                </p>
              )}
            </div>
          )}

          {!isReplyModal && (
            <div className="flex items-center justify-between max-w-md">
              <button
                className="flex items-center space-x-2 text-gray-500 dark:text-dark-text-secondary hover:text-twitter-blue transition-colors group"
                onClick={handleReplyClick}
              >
                <div className="p-2 rounded-full group-hover:bg-twitter-blue/10 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span className="text-sm">
                  {formatNumber(tweet.repliesCount || 0)}
                </span>
              </button>

              <button
                onClick={handleRetweet}
                className={`flex items-center space-x-2 transition-colors group ${
                  retweeted
                    ? "text-green-500"
                    : "text-gray-500 dark:text-dark-text-secondary hover:text-green-500"
                }`}
              >
                <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                  <Repeat2 className="h-5 w-5" />
                </div>
                <span className="text-sm">{formatNumber(retweetsCount)}</span>
              </button>

              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors group ${
                  liked
                    ? "text-red-500"
                    : "text-gray-500 dark:text-dark-text-secondary hover:text-red-500"
                }`}
              >
                <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                  <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                </div>
                <span className="text-sm">{formatNumber(likesCount)}</span>
              </button>

              <button
                onClick={stopPropagation}
                className="flex items-center space-x-2 text-gray-500 dark:text-dark-text-secondary hover:text-twitter-blue transition-colors group"
              >
                <div className="p-2 rounded-full group-hover:bg-twitter-blue/10 transition-colors">
                  <Share className="h-5 w-5" />
                </div>
              </button>
            </div>
          )}

          {showReplyModal && (
            <ReplyModal
              isOpen={showReplyModal}
              onClose={handleModalClose}
              parentTweet={tweet}
            />
          )}
        </div>
      </div>
    </article>
  );
};

export default memo(Tweet);
