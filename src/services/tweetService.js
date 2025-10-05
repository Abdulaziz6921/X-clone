// import {
//   collection,
//   collectionGroup,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   doc,
//   updateDoc,
//   increment,
//   arrayUnion,
//   arrayRemove,
//   getDoc,
//   where,
//   getDocs,
//   limit,
//   startAfter,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../config/firebase";

// export const createTweet = async (tweetData) => {
//   try {
//     const tweetsRef = collection(db, "tweets");
//     const docRef = await addDoc(tweetsRef, {
//       ...tweetData,
//       createdAt: new Date(),
//       likesCount: 0,
//       retweetsCount: 0,
//       repliesCount: 0,
//       likedBy: [],
//       retweetedBy: [],
//     });

//     // Update user's tweet count
//     const userRef = doc(db, "users", tweetData.userId);
//     await updateDoc(userRef, {
//       tweetsCount: increment(1),
//     });

//     return docRef.id;
//   } catch (error) {
//     console.error("Error creating tweet:", error);
//     throw error;
//   }
// };

// export const getTweets = (callback) => {
//   const tweetsRef = collection(db, "tweets");
//   const q = query(tweetsRef, orderBy("createdAt", "desc"), limit(20));

//   return onSnapshot(q, (snapshot) => {
//     const tweets = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     callback(tweets);
//   });
// };

// export const getUserTweets = (userId, callback) => {
//   const tweetsRef = collection(db, "tweets");
//   const q = query(
//     tweetsRef,
//     where("userId", "==", userId),
//     orderBy("createdAt", "desc")
//   );

//   return onSnapshot(q, (snapshot) => {
//     const tweets = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     callback(tweets);
//   });
// };

// export const likeTweet = async (tweetId, userId) => {
//   try {
//     const tweetRef = doc(db, "tweets", tweetId);
//     const tweetDoc = await getDoc(tweetRef);

//     if (tweetDoc.exists()) {
//       const tweetData = tweetDoc.data();
//       const isLiked = tweetData.likedBy?.includes(userId);

//       if (isLiked) {
//         // Unlike
//         await updateDoc(tweetRef, {
//           likesCount: increment(-1),
//           likedBy: arrayRemove(userId),
//         });
//       } else {
//         // Like
//         await updateDoc(tweetRef, {
//           likesCount: increment(1),
//           likedBy: arrayUnion(userId),
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error liking tweet:", error);
//     throw error;
//   }
// };

// export const retweetTweet = async (tweetId, userId) => {
//   try {
//     const tweetRef = doc(db, "tweets", tweetId);
//     const tweetDoc = await getDoc(tweetRef);

//     if (tweetDoc.exists()) {
//       const tweetData = tweetDoc.data();
//       const isRetweeted = tweetData.retweetedBy?.includes(userId);

//       if (isRetweeted) {
//         // Unretweet
//         await updateDoc(tweetRef, {
//           retweetsCount: increment(-1),
//           retweetedBy: arrayRemove(userId),
//         });
//       } else {
//         // Retweet
//         await updateDoc(tweetRef, {
//           retweetsCount: increment(1),
//           retweetedBy: arrayUnion(userId),
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error retweeting:", error);
//     throw error;
//   }
// };

// // replyService
// export const listenToReplies = (tweetId, callback) => {
//   const repliesRef = collection(db, "tweets", tweetId, "replies");
//   const q = query(repliesRef, orderBy("createdAt", "asc"));
//   return onSnapshot(q, (snapshot) => {
//     const replies = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     callback(replies);
//   });
// };

// export const addReply = async (tweetId, replyData) => {
//   try {
//     // Get the parent tweet
//     const parentTweetRef = doc(db, "tweets", tweetId);
//     const parentSnap = await getDoc(parentTweetRef);

//     let replyToUsername = "";

//     if (parentSnap.exists()) {
//       const parentData = parentSnap.data();
//       replyToUsername = parentData.username || "";
//     }

//     // Save the reply under 'replies' subcollection
//     const repliesRef = collection(db, "tweets", tweetId, "replies");
//     await addDoc(repliesRef, {
//       ...replyData,
//       replyToUsername, // 👈 Add this
//       createdAt: serverTimestamp(),
//     });

//     // Increment reply count
//     await updateDoc(parentTweetRef, {
//       repliesCount: increment(1),
//     });
//   } catch (error) {
//     console.error("Failed to post reply:", error);
//     throw error;
//   }
// };

// export const getUserReplies = (userId, callback) => {
//   const q = query(
//     collectionGroup(db, "replies"),
//     where("userId", "==", userId),
//     orderBy("createdAt", "desc")
//   );

//   return onSnapshot(q, async (snapshot) => {
//     const groupedReplies = {};

//     for (const replyDoc of snapshot.docs) {
//       const reply = replyDoc.data();
//       const parentTweetId = replyDoc.ref.parent.parent.id;

//       // Initialize the group if it doesn't exist
//       if (!groupedReplies[parentTweetId]) {
//         const parentRef = doc(db, "tweets", parentTweetId);
//         const parentSnap = await getDoc(parentRef);

//         groupedReplies[parentTweetId] = {
//           parentTweetId,
//           parentTweet: parentSnap.exists()
//             ? { id: parentSnap.id, ...parentSnap.data() }
//             : null,
//           userReplies: [],
//         };
//       }

//       // Add the current reply to the correct group
//       groupedReplies[parentTweetId].userReplies.push({
//         id: replyDoc.id,
//         ...reply,
//       });
//     }

//     // Convert the grouped replies object into an array for rendering
//     callback(Object.values(groupedReplies));
//   });
// };

import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  collectionGroup,
  serverTimestamp,
} from "firebase/firestore";

/* -------------------------- 🐦 TWEET OPERATIONS -------------------------- */
export const createTweet = async (tweetData) => {
  try {
    const tweetsRef = collection(db, "tweets");
    const newTweet = {
      ...tweetData,
      createdAt: new Date(),
      likesCount: 0,
      retweetsCount: 0,
      repliesCount: 0,
      likedBy: [],
      retweetedBy: [],
    };
    const docRef = await addDoc(tweetsRef, newTweet);

    // Increment user’s tweet count
    await updateDoc(doc(db, "users", tweetData.userId), {
      tweetsCount: increment(1),
    });

    return docRef.id;
  } catch (err) {
    console.error("Error creating tweet:", err);
    throw err;
  }
};

export const getTweets = (callback) => {
  const q = query(
    collection(db, "tweets"),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

export const getUserTweets = (userId, callback) => {
  const q = query(
    collection(db, "tweets"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

/* -------------------------- ❤️ LIKE / RETWEET --------------------------- */
const toggleAction = async (tweetId, userId, field) => {
  const tweetRef = doc(db, "tweets", tweetId);
  const snap = await getDoc(tweetRef);

  if (!snap.exists()) return;
  const data = snap.data();
  const isActive = data[field]?.includes(userId);
  const update = isActive
    ? { [`${field}Count`]: increment(-1), [field]: arrayRemove(userId) }
    : { [`${field}Count`]: increment(1), [field]: arrayUnion(userId) };

  await updateDoc(tweetRef, update);
};

export const likeTweet = (tweetId, userId) =>
  toggleAction(tweetId, userId, "likedBy");
export const retweetTweet = (tweetId, userId) =>
  toggleAction(tweetId, userId, "retweetedBy");

/* ----------------------------- 💬 REPLIES ------------------------------- */
export const listenToReplies = (tweetId, callback) => {
  const q = query(
    collection(db, "tweets", tweetId, "replies"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

export const addReply = async (tweetId, replyData) => {
  try {
    const parentRef = doc(db, "tweets", tweetId);
    const parentSnap = await getDoc(parentRef);
    const replyToUsername = parentSnap.exists()
      ? parentSnap.data().username || ""
      : "";

    await addDoc(collection(db, "tweets", tweetId, "replies"), {
      ...replyData,
      replyToUsername,
      createdAt: serverTimestamp(),
    });

    await updateDoc(parentRef, { repliesCount: increment(1) });
  } catch (err) {
    console.error("Failed to post reply:", err);
    throw err;
  }
};

export const getUserReplies = (userId, callback) => {
  const q = query(
    collectionGroup(db, "replies"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, async (snap) => {
    const grouped = {};
    for (const docSnap of snap.docs) {
      const reply = docSnap.data();
      const parentId = docSnap.ref.parent.parent.id;

      if (!grouped[parentId]) {
        const parentRef = doc(db, "tweets", parentId);
        const parentSnap = await getDoc(parentRef);
        grouped[parentId] = {
          parentTweetId: parentId,
          parentTweet: parentSnap.exists()
            ? { id: parentSnap.id, ...parentSnap.data() }
            : null,
          userReplies: [],
        };
      }
      grouped[parentId].userReplies.push({ id: docSnap.id, ...reply });
    }
    callback(Object.values(grouped));
  });
};
