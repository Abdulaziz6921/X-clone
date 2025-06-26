import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useUserCacheContext } from "../contexts/UserCacheContext";

export const useUserCache = (userId) => {
  const { userCache, updateUserInCache } = useUserCacheContext();
  const [userData, setUserData] = useState(userCache[userId] || null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userCache[userId]) {
        setUserData(userCache[userId]);
        return;
      }

      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          updateUserInCache(userId, data);
          setUserData(data);
        }
      } catch (error) {
        console.error("Failed to fetch user from Firestore:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, userCache, updateUserInCache]);

  return userData;
};
