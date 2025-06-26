import { useEffect } from "react";
import TweetComposer from "./TweetComposer";
import { ArrowLeft, X } from "lucide-react";
import Tweet from "./Tweet";
import { Link } from "react-router-dom";
import ReplyThread from "./ReplyThread";

const ReplyModal = ({ isOpen, onClose, parentTweet }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen || !parentTweet) return null;
  console.log("Parent tweet:", parentTweet);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[9999] bg-blue-200/20  flex items-start justify-center md:px-4  md:pt-[10vh] "
    >
      <div className=" w-full h-full md:max-w-xl md:h-fit md:max-h-[90vh] bg-white dark:bg-dark-bg md:rounded-2xl shadow-xl relative p-4 md:p-4 flex flex-col items-start overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="hover:bg-gray-100 dark:hover:bg-dark-bg-secondary text-white rounded-full mb-6"
        >
          <X className="hidden md:block h-5 w-5" />

          <ArrowLeft className="block md:hidden h-5 w-5" />
        </button>

        <div className="relative">
          <ReplyThread
            groupedReplies={[{ parentTweet, userReplies: [] }]}
            hideMedia={true}
            compact={true}
            isReplyModal={true}
          />
        </div>

        {/* Reply Composer */}
        <TweetComposer
          isReplyModal
          replyingToTweet={parentTweet}
          onTweetCreated={onClose}
        />
      </div>
    </div>
  );
};

export default ReplyModal;
