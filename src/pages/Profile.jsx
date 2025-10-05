// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, MapPin, Link as LinkIcon, Calendar } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   getUserProfile,
//   followUser,
//   unfollowUser,
// } from "../services/userService";
// import {
//   getUserTweets,
//   getTweets,
//   getUserReplies,
// } from "../services/tweetService";
// import TweetList from "../components/Tweet/TweetList";
// import dayjs from "dayjs";

// const Profile = () => {
//   const { username } = useParams();
//   const navigate = useNavigate();

//   const { currentUser, userProfile: currentUserProfile } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [tweets, setTweets] = useState([]);
//   const [activeTab, setActiveTab] = useState("tweets");
//   const [loading, setLoading] = useState(true);
//   const [tweetsLoading, setTweetsLoading] = useState(true);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [isOwnProfile, setIsOwnProfile] = useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const profileData = await getUserProfile(username);
//         setProfile(profileData);
//         setIsOwnProfile(profileData?.uid === currentUser?.uid);
//         setIsFollowing(
//           currentUserProfile?.following?.includes(profileData?.uid) || false
//         );
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (username && currentUser) {
//       fetchProfile();
//     }
//   }, [username, currentUser, currentUserProfile]);

//   useEffect(() => {
//     if (!profile?.uid) return;

//     setTweetsLoading(true);
//     let unsubscribe;

//     if (activeTab === "likes") {
//       unsubscribe = getTweets((allTweets) => {
//         setTweets(allTweets);
//         setTweetsLoading(false);
//       });
//     } else if (activeTab === "replies") {
//       unsubscribe = getUserReplies(profile.uid, (groupedReplies) => {
//         console.log("Grouped replies from Firestore:", groupedReplies);
//         setTweets(groupedReplies || []); // This is now an array of objects { parentTweet, userReplies }
//         setTweetsLoading(false);
//       });
//     } else {
//       unsubscribe = getUserTweets(profile.uid, (userTweets) => {
//         setTweets(userTweets);
//         setTweetsLoading(false);
//       });
//     }

//     return () => {
//       if (unsubscribe) unsubscribe();
//     };
//   }, [profile, activeTab]);
//   const filterTweets = () => {
//     if (!Array.isArray(tweets)) return [];
//     if (activeTab === "media") {
//       return tweets.filter(
//         (tweet) =>
//           tweet.mediaUrls &&
//           tweet.mediaUrls.some((url) =>
//             /\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg)$/i.test(url)
//           )
//       );
//     } else if (activeTab === "likes") {
//       return tweets.filter((tweet) =>
//         tweet.likedBy?.includes(currentUser?.uid)
//       );
//     } else if (activeTab === "replies") {
//       return tweets;
//     }

//     return tweets.filter((tweet) => tweet.userId === profile?.uid);
//   };

//   const handleFollow = async () => {
//     if (!currentUser || !profile) return;

//     try {
//       if (isFollowing) {
//         await unfollowUser(currentUser.uid, profile.uid);
//       } else {
//         await followUser(currentUser.uid, profile.uid);
//       }
//       setIsFollowing(!isFollowing);
//     } catch (error) {
//       console.error("Error following/unfollowing user:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen">
//         <div className="animate-pulse">
//           <div className="h-48 bg-gray-200 dark:bg-dark-bg-secondary"></div>
//           <div className="p-4">
//             <div className="w-24 h-24 bg-gray-200 dark:bg-dark-bg-secondary rounded-full -mt-12 mb-4"></div>
//             <div className="space-y-2">
//               <div className="h-6 bg-gray-200 dark:bg-dark-bg-secondary rounded w-1/4"></div>
//               <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded w-1/6"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">
//             Profile not found
//           </h2>
//           <p className="text-gray-500 dark:text-dark-text-secondary">
//             The profile you're looking for doesn't exist.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Header */}
//       <div className="sticky top-0 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border z-10">
//         <div className="flex items-center p-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors mr-4"
//           >
//             <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-dark-text" />
//           </button>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text">
//               {profile.displayName}
//             </h1>
//             <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
//               {profile.tweetsCount || 0} Tweets
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Cover Photo */}
//       <div className="h-48 bg-gradient-to-r from-twitter-blue to-twitter-blue-dark"></div>

//       {/* Profile Info */}
//       <div className="px-4 pb-4">
//         <div className="flex justify-between items-start -mt-16 mb-4">
//           <div className="w-32 h-32 bg-twitter-blue rounded-full border-4 border-white dark:border-dark-bg flex items-center justify-center">
//             {profile.avatarUrl ? (
//               <img
//                 src={profile.avatarUrl}
//                 alt="Avatar"
//                 className="w-full h-full object-cover rounded-full"
//               />
//             ) : (
//               <span className="text-white font-bold text-4xl">
//                 {profile.displayName?.charAt(0)?.toUpperCase() || "U"}
//               </span>
//             )}
//           </div>

//           {isOwnProfile ? (
//             <button
//               onClick={() => navigate("/settings")}
//               className="px-6 py-2 rounded-full font-semibold bg-gray-200 dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text hover:bg-gray-300 dark:hover:bg-dark-bg-tertiary transition-colors"
//             >
//               Edit Profile
//             </button>
//           ) : (
//             <button
//               onClick={handleFollow}
//               className={`px-6 py-2 rounded-full font-semibold transition-colors ${
//                 isFollowing
//                   ? "bg-gray-200 dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text hover:bg-red-100 hover:text-red-600"
//                   : "bg-twitter-blue text-white hover:bg-twitter-blue-dark"
//               }`}
//             >
//               {isFollowing ? "Following" : "Follow"}
//             </button>
//           )}
//         </div>

//         <div className="mb-4">
//           <div className="flex items-center space-x-2 mb-1">
//             <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">
//               {profile.displayName}
//             </h2>
//             {profile.verified && (
//               <svg
//                 className="w-6 h-6 text-twitter-blue"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             )}
//           </div>
//           <p className="text-gray-500 dark:text-dark-text-secondary mb-3">
//             @{profile.username}
//           </p>

//           {profile.bio && (
//             <p className="text-gray-900 dark:text-dark-text mb-3">
//               {profile.bio}
//             </p>
//           )}

//           <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 dark:text-dark-text-secondary mb-3">
//             {profile.location && (
//               <div className="flex items-center space-x-1">
//                 <MapPin className="h-4 w-4" />
//                 <span>{profile.location}</span>
//               </div>
//             )}
//             {profile.website && (
//               <div className="flex items-center space-x-1">
//                 <LinkIcon className="h-4 w-4" />
//                 <a
//                   href={profile.website}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-twitter-blue hover:underline"
//                 >
//                   {profile.website}
//                 </a>
//               </div>
//             )}
//             <div className="flex items-center space-x-1">
//               <Calendar className="h-4 w-4" />
//               <span>
//                 Joined {dayjs(profile.joinedAt?.toDate()).format("MMMM YYYY")}
//               </span>
//             </div>
//           </div>

//           <div className="flex space-x-4 text-sm">
//             <span className="text-gray-500 dark:text-dark-text-secondary">
//               <span className="font-bold text-gray-900 dark:text-dark-text">
//                 {profile.followingCount || 0}
//               </span>{" "}
//               Following
//             </span>
//             <span className="text-gray-500 dark:text-dark-text-secondary">
//               <span className="font-bold text-gray-900 dark:text-dark-text">
//                 {profile.followersCount || 0}
//               </span>{" "}
//               Followers
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="border-b border-gray-200 dark:border-dark-border">
//         <div className="flex">
//           {["tweets", "replies", "media", "likes"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 py-4 text-center font-semibold transition-colors ${
//                 activeTab === tab
//                   ? "text-gray-900 dark:text-dark-text border-b-2 border-twitter-blue"
//                   : "text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text"
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Tweets */}
//       <TweetList
//         tweets={filterTweets()}
//         loading={tweetsLoading}
//         activeTab={activeTab}
//         isOwnProfile={isOwnProfile}
//         profile={profile}
//       />
//     </div>
//   );
// };

// export default Profile;
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import dayjs from "dayjs";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserProfile,
  followUser,
  unfollowUser,
} from "../services/userService";
import {
  getUserTweets,
  getTweets,
  getUserReplies,
} from "../services/tweetService";
import TweetList from "../components/Tweet/TweetList";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile: currentUserProfile } = useAuth();

  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [cachedTweets, setCachedTweets] = useState({});
  const [activeTab, setActiveTab] = useState("tweets");
  const [loading, setLoading] = useState(true);
  const [tweetsLoading, setTweetsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = profile?.uid === currentUser?.uid;

  // Fetching user profile
  useEffect(() => {
    if (!username || !currentUser) return;

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(username);
        setProfile(data);
        setIsFollowing(
          currentUserProfile?.following?.includes(data?.uid) || false
        );
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, currentUser, currentUserProfile]);

  // Fetching tweets based on tab (cached to prevent redundant reads)
  useEffect(() => {
    if (!profile?.uid) return;

    if (cachedTweets[activeTab]) {
      setTweets(cachedTweets[activeTab]);
      setTweetsLoading(false);
      return;
    }

    setTweetsLoading(true);
    let unsubscribe;

    const handleData = (data) => {
      setTweets(data);
      setCachedTweets((prev) => ({ ...prev, [activeTab]: data }));
      setTweetsLoading(false);
    };

    if (activeTab === "likes") unsubscribe = getTweets(handleData);
    else if (activeTab === "replies")
      unsubscribe = getUserReplies(profile.uid, handleData);
    else unsubscribe = getUserTweets(profile.uid, handleData);

    return () => unsubscribe && unsubscribe();
  }, [profile, activeTab]);

  // Utility for filtering tweets
  const hasMedia = (tweet) =>
    tweet.mediaUrls?.some((url) =>
      /\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg)$/i.test(url)
    );

  const filteredTweets = useMemo(() => {
    if (!Array.isArray(tweets)) return [];
    if (activeTab === "media") return tweets.filter(hasMedia);
    if (activeTab === "likes")
      return tweets.filter((t) => t.likedBy?.includes(currentUser?.uid));
    return tweets;
  }, [tweets, activeTab, currentUser?.uid]);

  // Handling Follow/Unfollow
  const handleFollow = async () => {
    if (!currentUser || !profile) return;
    try {
      if (isFollowing) await unfollowUser(currentUser.uid, profile.uid);
      else await followUser(currentUser.uid, profile.uid);
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Follow/unfollow error:", err);
    }
  };

  // Loading state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-48 bg-gray-200 dark:bg-dark-bg-secondary mb-4"></div>
          <div className="w-24 h-24 bg-gray-300 dark:bg-dark-bg-secondary rounded-full mx-auto mb-3"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">
          Profile not found
        </h2>
        <p className="text-gray-500 dark:text-dark-text-secondary">
          The profile you’re looking for doesn’t exist.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-dark-text" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text">
              {profile.displayName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
              {profile.tweetsCount || 0} Tweets
            </p>
          </div>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-twitter-blue to-twitter-blue-dark"></div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start -mt-16 mb-4">
          <div className="w-28 h-28 sm:w-32 sm:h-32 bg-twitter-blue rounded-full border-4 border-white dark:border-dark-bg overflow-hidden">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white text-3xl font-bold">
                {profile.displayName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          {isOwnProfile ? (
            <button
              onClick={() => navigate("/settings")}
              className="px-5 py-2 rounded-full font-semibold bg-gray-200 dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text hover:bg-gray-300 dark:hover:bg-dark-bg-tertiary transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                isFollowing
                  ? "bg-gray-200 dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text hover:bg-red-100 hover:text-red-600"
                  : "bg-twitter-blue text-white hover:bg-twitter-blue-dark"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* User details */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">
              {profile.displayName}
            </h2>
            {profile.verified && (
              <svg
                className="w-5 h-5 text-twitter-blue"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          <p className="text-gray-500 dark:text-dark-text-secondary mb-3">
            @{profile.username}
          </p>

          {profile.bio && (
            <p className="text-gray-900 dark:text-dark-text mb-3 whitespace-pre-line">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-dark-text-secondary mb-3">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </span>
            )}
            {profile.website && (
              <span className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-twitter-blue hover:underline"
                >
                  {profile.website}
                </a>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {dayjs(profile.joinedAt?.toDate()).format("MMMM YYYY")}
            </span>
          </div>

          <div className="flex gap-4 text-sm">
            <span>
              <span className="font-bold text-gray-900 dark:text-dark-text">
                {profile.followingCount || 0}
              </span>{" "}
              Following
            </span>
            <span>
              <span className="font-bold text-gray-900 dark:text-dark-text">
                {profile.followersCount || 0}
              </span>{" "}
              Followers
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-dark-border flex">
        {["tweets", "replies", "media", "likes"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === tab
                ? "text-gray-900 dark:text-dark-text border-b-2 border-twitter-blue"
                : "text-gray-500 dark:text-dark-text-secondary hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tweets Section */}
      <div key={activeTab}>
        <TweetList
          tweets={filteredTweets}
          loading={tweetsLoading}
          activeTab={activeTab}
          isOwnProfile={isOwnProfile}
          profile={profile}
        />
      </div>
    </div>
  );
};

export default Profile;
