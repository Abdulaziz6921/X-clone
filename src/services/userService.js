// import {
//   doc,
//   getDoc,
//   updateDoc,
//   collection,
//   query,
//   where,
//   getDocs,
//   arrayUnion,
//   arrayRemove,
//   increment,
// } from "firebase/firestore";
// import { db } from "../config/firebase";

// export const getUserProfile = async (username) => {
//   try {
//     const usersRef = collection(db, "users");
//     const q = query(usersRef, where("username", "==", username));
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       const userDoc = querySnapshot.docs[0];
//       return { id: userDoc.id, ...userDoc.data() };
//     }
//     return null;
//   } catch (error) {
//     console.error("Error getting user profile:", error);
//     throw error;
//   }
// };

// export const followUser = async (currentUserId, targetUserId) => {
//   try {
//     const currentUserRef = doc(db, "users", currentUserId);
//     const targetUserRef = doc(db, "users", targetUserId);

//     // Add to current user's following list
//     await updateDoc(currentUserRef, {
//       following: arrayUnion(targetUserId),
//       followingCount: increment(1),
//     });

//     // Add to target user's followers list
//     await updateDoc(targetUserRef, {
//       followers: arrayUnion(currentUserId),
//       followersCount: increment(1),
//     });
//   } catch (error) {
//     console.error("Error following user:", error);
//     throw error;
//   }
// };

// export const unfollowUser = async (currentUserId, targetUserId) => {
//   try {
//     const currentUserRef = doc(db, "users", currentUserId);
//     const targetUserRef = doc(db, "users", targetUserId);

//     // Remove from current user's following list
//     await updateDoc(currentUserRef, {
//       following: arrayRemove(targetUserId),
//       followingCount: increment(-1),
//     });

//     // Remove from target user's followers list
//     await updateDoc(targetUserRef, {
//       followers: arrayRemove(currentUserId),
//       followersCount: increment(-1),
//     });
//   } catch (error) {
//     console.error("Error unfollowing user:", error);
//     throw error;
//   }
// };

// export const updateUserProfile = async (userId, updates) => {
//   try {
//     const userRef = doc(db, "users", userId);
//     await updateDoc(userRef, updates);
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     throw error;
//   }
// };

// src/services/userService.js
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
  arrayRemove,
  increment,
  runTransaction,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Fetch user profile by username
 */
export const getUserProfile = async (username) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Real-time listener for user profile
 */
export const listenToUserProfile = (userId, callback) => {
  const userRef = doc(db, "users", userId);
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() });
    } else {
      callback(null);
    }
  });
};

/**
 * Follow user (safe with transaction)
 */
export const followUser = async (currentUserId, targetUserId) => {
  const currentUserRef = doc(db, "users", currentUserId);
  const targetUserRef = doc(db, "users", targetUserId);

  try {
    await runTransaction(db, async (transaction) => {
      const currentSnap = await transaction.get(currentUserRef);
      const targetSnap = await transaction.get(targetUserRef);

      if (!currentSnap.exists() || !targetSnap.exists())
        throw new Error("User not found");

      const currentData = currentSnap.data();
      if (currentData.following?.includes(targetUserId)) return; // already following

      transaction.update(currentUserRef, {
        following: arrayUnion(targetUserId),
        followingCount: increment(1),
      });
      transaction.update(targetUserRef, {
        followers: arrayUnion(currentUserId),
        followersCount: increment(1),
      });
    });
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

/**
 * Unfollow user (safe with transaction)
 */
export const unfollowUser = async (currentUserId, targetUserId) => {
  const currentUserRef = doc(db, "users", currentUserId);
  const targetUserRef = doc(db, "users", targetUserId);

  try {
    await runTransaction(db, async (transaction) => {
      const currentSnap = await transaction.get(currentUserRef);
      const targetSnap = await transaction.get(targetUserRef);

      if (!currentSnap.exists() || !targetSnap.exists())
        throw new Error("User not found");

      const currentData = currentSnap.data();
      if (!currentData.following?.includes(targetUserId)) return; // not following

      transaction.update(currentUserRef, {
        following: arrayRemove(targetUserId),
        followingCount: increment(-1),
      });
      transaction.update(targetUserRef, {
        followers: arrayRemove(currentUserId),
        followersCount: increment(-1),
      });
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};

/**
 * Check if current user follows another user
 */
export const isFollowing = async (currentUserId, targetUserId) => {
  try {
    const currentUserRef = doc(db, "users", currentUserId);
    const currentSnap = await getDoc(currentUserRef);
    if (!currentSnap.exists()) return false;

    const data = currentSnap.data();
    return data.following?.includes(targetUserId);
  } catch (error) {
    console.error("Error checking following status:", error);
    return false;
  }
};

/**
 * Update user profile (displayName, bio, etc.)
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
