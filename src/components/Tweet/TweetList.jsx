// import Tweet from "./Tweet";

// const TweetList = ({ tweets, loading, activeTab }) => {
//   // console.log(activeTab);
//   if (loading) {
//     return (
//       <div className="space-y-4 p-4">
//         {Array.from({ length: 5 }).map((_, index) => (
//           <div key={index} className="animate-pulse">
//             <div className="flex space-x-3">
//               <div className="w-12 h-12 bg-gray-200 dark:bg-dark-bg-secondary rounded-full"></div>
//               <div className="flex-1 space-y-2">
//                 <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded w-1/4"></div>
//                 <div className="space-y-2">
//                   <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded"></div>
//                   <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded w-3/4"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   {
//     if (tweets.length === 0) {
//       return (
//         <div className="text-center md:p-14 p-10">
//           <p className="text-gray-500 dark:text-dark-text-secondary md:text-lg text-sm md:px-20">
//             {activeTab === "replies"
//               ? "When you reply to any tweet, it’ll show up here"
//               : activeTab === "tweets"
//               ? "When you post tweets, they will show up here."
//               : activeTab === "media"
//               ? "When you post photos or videos, they will show up here."
//               : activeTab === "likes"
//               ? "Tap the heart on any tweet to show it some love. When you do, it’ll show up here."
//               : "do nothing"}
//           </p>
//         </div>
//       );
//     }
//   }

//   return (
//     <div>
//       {tweets.map((tweet) =>
//         tweet.parentTweet ? (
//           <div
//             key={tweet.id}
//             className="flex flex-col gap-4 items-start border-b py-4"
//           >
//             <div className="w-full bg-red-400">
//               <Tweet tweet={tweet.parentTweet} />
//             </div>
//             <div className="w-full bg-green-500">
//               <Tweet tweet={tweet} />
//             </div>
//           </div>
//         ) : (
//           <Tweet key={tweet.id} tweet={tweet} />
//         )
//       )}
//     </div>
//   );
// };

// export default TweetList;
import ReplyThread from "./ReplyThread";
import Tweet from "./Tweet";

const TweetList = ({ tweets, loading, activeTab, isOwnProfile, profile }) => {
  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex space-x-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-dark-bg-secondary rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="text-center md:p-14 p-10">
        <p className="text-gray-500 dark:text-dark-text-secondary md:text-lg text-sm md:px-20">
          {activeTab === "replies"
            ? `When ${
                isOwnProfile ? "you" : profile?.displayName || "this user"
              } repl${
                isOwnProfile ? "y" : "ies"
              } to any tweet, it’ll show up here`
            : activeTab === "tweets"
            ? `When ${
                isOwnProfile ? "you" : profile?.displayName || "this user"
              } post${isOwnProfile ? "" : "s"} tweets, they will show up here.`
            : activeTab === "media"
            ? `When ${
                isOwnProfile ? "you" : profile?.displayName || "this user"
              } post${
                isOwnProfile ? "" : "s"
              } photos or videos, they will show up here.`
            : activeTab === "likes"
            ? `Tweets liked by ${
                isOwnProfile ? "you" : profile?.displayName || "this user"
              } will appear here.`
            : "Nothing to show."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeTab === "replies" ? (
        <ReplyThread groupedReplies={tweets} />
      ) : (
        tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />)
      )}
    </div>
  );
};

export default TweetList;
