import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";

interface UserInfo {
  isLogin: boolean;
  name?: string;
}

interface UserContextType {
  user: UserInfo;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

const hashPassword = (password: string) => {
  return btoa(password);
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo>({ isLogin: false });
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({
        isLogin: true,
        name: userData.username,
      });
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const users = localStorage.getItem('users');
    const userList = users ? JSON.parse(users) : [];
    const hashedPassword = hashPassword(password);
    
    const foundUser = userList.find((u: any) => 
      u.username === username && u.password === hashedPassword
    );
  
    if (foundUser) {
      setUser({
        isLogin: true,
        name: username,
      });
      localStorage.setItem('currentUser', JSON.stringify({ username }));
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (username: string, password: string): Promise<boolean> => {
    const users = localStorage.getItem('users');
    const userList = users ? JSON.parse(users) : [];

    if (userList.find((u: any) => u.username === username)) {
      return false;
    }

    const hashedPassword = hashPassword(password);
    userList.push({ username, password: hashedPassword });
    localStorage.setItem('users', JSON.stringify(userList));

    setUser({
      isLogin: true,
      name: username,
    });
    localStorage.setItem('currentUser', JSON.stringify({ username }));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser({ isLogin: false });
    localStorage.removeItem('currentUser');
  }, []);

  const value = useMemo(() => ({
    user,
    login,
    register,
    logout
  }), [user, login, register, logout]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext)!; 