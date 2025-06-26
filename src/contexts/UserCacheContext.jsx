// src/contexts/UserCacheContext.jsx
import { createContext, useContext, useState } from "react";

const UserCacheContext = createContext();

export const UserCacheProvider = ({ children }) => {
  const [userCache, setUserCache] = useState({});

  const updateUserInCache = (userId, userData) => {
    setUserCache((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        ...userData,
      },
    }));
  };

  return (
    <UserCacheContext.Provider value={{ userCache, updateUserInCache }}>
      {children}
    </UserCacheContext.Provider>
  );
};

export const useUserCacheContext = () => useContext(UserCacheContext);
