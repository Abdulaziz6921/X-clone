// import Tweet from "./Tweet";
// import { Link } from "react-router-dom";
// import { useRef, useEffect, useState } from "react";

// const ReplyThread = ({
//   groupedReplies,
//   hideMedia = false,
//   compact = false,
//   isReplyModal,
// }) => {
//   const tweetRef = useRef(null);
//   const [tweetHeight, setTweetHeight] = useState(0);
//   useEffect(() => {
//     if (tweetRef.current) {
//       setTweetHeight(tweetRef.current.offsetHeight);
//     }
//   }, [tweetRef.current]);
//   if (!Array.isArray(groupedReplies) || groupedReplies.length === 0)
//     return null;

//   return (
//     <div className="flex flex-col">
//       {groupedReplies.map((group, index) => {
//         const parentTweet = group?.parentTweet;
//         const userReplies = group?.userReplies ?? [];

//         if (!parentTweet) return null;

//         return (
//           <div
//             key={parentTweet.id || index}
//             className={`relative w-full ${
//               !compact
//                 ? "px-4 py-2 border-b border-gray-200 dark:border-dark-border"
//                 : ""
//             } `}
//           >
//             {/* Parent tweet with ref */}
//             <div ref={tweetRef}>
//               <Tweet
//                 tweet={parentTweet}
//                 isReplyModal
//                 hideMedia={hideMedia}
//                 isParent
//               />
//             </div>
//             {/* Left vertical line only for first reply */}
//             <div className="w-10 md:w-12 flex justify-center ">
//               <div
//                 className={`w-px bg-gray-300 dark:bg-gray-600 absolute top-10 ${
//                   isReplyModal ? "md:top-12" : "md:top-14"
//                 } `}
//                 style={{
//                   height: tweetHeight,
//                 }}
//               />
//             </div>
//             {/* Replying to line */}
//             {isReplyModal && (
//               <div className="flex space-x-3 mt-2 mb-4 ">
//                 <div className="w-10 md:w-12 flex justify-center "></div>
//                 {/* Replying to text */}
//                 {isReplyModal && (
//                   <div className="flex-1 min-w-0 text-sm text-gray-500 dark:text-dark-text-secondary">
//                     Replying to{" "}
//                     <Link
//                       to={`/profile/${parentTweet.username}`}
//                       className="text-twitter-blue hover:underline"
//                     >
//                       @{parentTweet.username}
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Replies */}
//             <div className="space-y-4">
//               {userReplies.map((reply, i) => (
//                 <div key={reply.id} className="flex space-x-3 relative">
//                   <div className="flex-1">
//                     <Tweet tweet={reply} isRepliesTab hideMedia={hideMedia} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ReplyThread;
import { useRef, useState, useEffect } from "react";
import Tweet from "./Tweet";
import { Link } from "react-router-dom";

const ReplyThread = ({
  groupedReplies,
  hideMedia = false,
  compact = false,
  isReplyModal,
}) => {
  if (!Array.isArray(groupedReplies) || groupedReplies.length === 0)
    return null;

  // ✅ Define the hook-using component inside
  const ReplyGroup = ({ group }) => {
    const parentTweet = group?.parentTweet;
    const userReplies = group?.userReplies ?? [];

    const tweetRef = useRef(null);
    const [tweetHeight, setTweetHeight] = useState(0);

    useEffect(() => {
      const updateHeight = () => {
        if (tweetRef.current) {
          let height = tweetRef.current.offsetHeight;
          if (window.innerWidth >= 768 && !isReplyModal) height -= 55;
          // Add extra on desktop
          setTweetHeight(height);
        }
      };

      updateHeight();
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }, []);

    if (!parentTweet) return null;

    return (
      <div
        key={parentTweet.id}
        className={`relative w-full ${
          !compact
            ? "px-4 py-2 border-b border-gray-200 dark:border-dark-border"
            : ""
        }`}
      >
        {/* Parent Tweet with dynamic height ref */}
        <div ref={tweetRef}>
          <Tweet
            tweet={parentTweet}
            isReplyModal={isReplyModal}
            hideMedia={hideMedia}
            isParent
          />
        </div>

        {/* Vertical line */}
        <div className="w-10 md:w-12 flex justify-center">
          <div
            className={`w-[2px] bg-gray-300 dark:bg-gray-600 absolute  ${
              isReplyModal ? "top-10 md:top-12" : "top-12 md:top-14"
            }`}
            style={{ height: tweetHeight }}
          />
        </div>

        {/* Replying to text (only in modal) */}
        {isReplyModal && (
          <div className="flex space-x-3 mt-2 mb-4">
            <div className="w-10 md:w-12 flex justify-center"></div>
            <div className="flex-1 min-w-0 text-sm text-gray-500 dark:text-dark-text-secondary">
              Replying to{" "}
              <Link
                to={`/profile/${parentTweet.username}`}
                className="text-twitter-blue hover:underline"
              >
                @{parentTweet.username}
              </Link>
            </div>
          </div>
        )}

        {/* Replies */}
        <div className="space-y-4">
          {userReplies.map((reply) => (
            <div key={reply.id} className="flex space-x-3 relative">
              <div className="flex-1">
                <Tweet tweet={reply} isRepliesTab hideMedia={hideMedia} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {groupedReplies.map((group, index) => (
        <ReplyGroup key={group?.parentTweet?.id || index} group={group} />
      ))}
    </div>
  );
};

export default ReplyThread;
