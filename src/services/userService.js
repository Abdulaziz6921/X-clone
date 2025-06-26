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
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const getUserProfile = async (username) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const followUser = async (currentUserId, targetUserId) => {
  try {
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);
    
    // Add to current user's following list
    await updateDoc(currentUserRef, {
      following: arrayUnion(targetUserId),
      followingCount: increment(1)
    });
    
    // Add to target user's followers list
    await updateDoc(targetUserRef, {
      followers: arrayUnion(currentUserId),
      followersCount: increment(1)
    });
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  try {
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);
    
    // Remove from current user's following list
    await updateDoc(currentUserRef, {
      following: arrayRemove(targetUserId),
      followingCount: increment(-1)
    });
    
    // Remove from target user's followers list
    await updateDoc(targetUserRef, {
      followers: arrayRemove(currentUserId),
      followersCount: increment(-1)
    });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};