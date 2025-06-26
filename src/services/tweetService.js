import {
  collection,
  collectionGroup,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  getDoc,
  where,
  getDocs,
  limit,
  startAfter,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const createTweet = async (tweetData) => {
  try {
    const tweetsRef = collection(db, "tweets");
    const docRef = await addDoc(tweetsRef, {
      ...tweetData,
      createdAt: new Date(),
      likesCount: 0,
      retweetsCount: 0,
      repliesCount: 0,
      likedBy: [],
      retweetedBy: [],
    });

    // Update user's tweet count
    const userRef = doc(db, "users", tweetData.userId);
    await updateDoc(userRef, {
      tweetsCount: increment(1),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating tweet:", error);
    throw error;
  }
};

export const getTweets = (callback) => {
  const tweetsRef = collection(db, "tweets");
  const q = query(tweetsRef, orderBy("createdAt", "desc"), limit(20));

  return onSnapshot(q, (snapshot) => {
    const tweets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(tweets);
  });
};

export const getUserTweets = (userId, callback) => {
  const tweetsRef = collection(db, "tweets");
  const q = query(
    tweetsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const tweets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(tweets);
  });
};

export const likeTweet = async (tweetId, userId) => {
  try {
    const tweetRef = doc(db, "tweets", tweetId);
    const tweetDoc = await getDoc(tweetRef);

    if (tweetDoc.exists()) {
      const tweetData = tweetDoc.data();
      const isLiked = tweetData.likedBy?.includes(userId);

      if (isLiked) {
        // Unlike
        await updateDoc(tweetRef, {
          likesCount: increment(-1),
          likedBy: arrayRemove(userId),
        });
      } else {
        // Like
        await updateDoc(tweetRef, {
          likesCount: increment(1),
          likedBy: arrayUnion(userId),
        });
      }
    }
  } catch (error) {
    console.error("Error liking tweet:", error);
    throw error;
  }
};

export const retweetTweet = async (tweetId, userId) => {
  try {
    const tweetRef = doc(db, "tweets", tweetId);
    const tweetDoc = await getDoc(tweetRef);

    if (tweetDoc.exists()) {
      const tweetData = tweetDoc.data();
      const isRetweeted = tweetData.retweetedBy?.includes(userId);

      if (isRetweeted) {
        // Unretweet
        await updateDoc(tweetRef, {
          retweetsCount: increment(-1),
          retweetedBy: arrayRemove(userId),
        });
      } else {
        // Retweet
        await updateDoc(tweetRef, {
          retweetsCount: increment(1),
          retweetedBy: arrayUnion(userId),
        });
      }
    }
  } catch (error) {
    console.error("Error retweeting:", error);
    throw error;
  }
};

// replyService
export const listenToReplies = (tweetId, callback) => {
  const repliesRef = collection(db, "tweets", tweetId, "replies");
  const q = query(repliesRef, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    const replies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(replies);
  });
};

export const addReply = async (tweetId, replyData) => {
  try {
    // Get the parent tweet
    const parentTweetRef = doc(db, "tweets", tweetId);
    const parentSnap = await getDoc(parentTweetRef);

    let replyToUsername = "";

    if (parentSnap.exists()) {
      const parentData = parentSnap.data();
      replyToUsername = parentData.username || "";
    }

    // Save the reply under 'replies' subcollection
    const repliesRef = collection(db, "tweets", tweetId, "replies");
    await addDoc(repliesRef, {
      ...replyData,
      replyToUsername, // 👈 Add this
      createdAt: serverTimestamp(),
    });

    // Increment reply count
    await updateDoc(parentTweetRef, {
      repliesCount: increment(1),
    });
  } catch (error) {
    console.error("Failed to post reply:", error);
    throw error;
  }
};

export const getUserReplies = (userId, callback) => {
  const q = query(
    collectionGroup(db, "replies"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, async (snapshot) => {
    const groupedReplies = {};

    for (const replyDoc of snapshot.docs) {
      const reply = replyDoc.data();
      const parentTweetId = replyDoc.ref.parent.parent.id;

      // Initialize the group if it doesn't exist
      if (!groupedReplies[parentTweetId]) {
        const parentRef = doc(db, "tweets", parentTweetId);
        const parentSnap = await getDoc(parentRef);

        groupedReplies[parentTweetId] = {
          parentTweetId,
          parentTweet: parentSnap.exists()
            ? { id: parentSnap.id, ...parentSnap.data() }
            : null,
          userReplies: [],
        };
      }

      // Add the current reply to the correct group
      groupedReplies[parentTweetId].userReplies.push({
        id: replyDoc.id,
        ...reply,
      });
    }

    // Convert the grouped replies object into an array for rendering
    callback(Object.values(groupedReplies));
  });
};
