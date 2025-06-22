import React, { createContext, useContext, useState, useEffect } from "react";

interface UserInfo {
  isLogin: boolean;
  name?: string;
  avatar?: string;
}

interface UserData {
  username: string;
  password: string;
}

interface UserContextType {
  user: UserInfo;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

// 简单的密码哈希函数
const hashPassword = (password: string) => {
  return btoa(password); // 简单的base64编码，实际项目中应使用更安全的哈希
};

// 从localStorage获取用户数据
const getUsers = (): UserData[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

// 保存用户数据到localStorage
const saveUsers = (users: UserData[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo>({ isLogin: false });

  // 检查localStorage中是否有已登录用户
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({
        isLogin: true,
        name: userData.username,
        avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${encodeURIComponent(userData.username)}`
      });
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const hashedPassword = hashPassword(password);
    const foundUser = users.find(u => u.username === username && u.password === hashedPassword);
    
    if (foundUser) {
      setUser({
        isLogin: true,
        name: username,
        avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${encodeURIComponent(username)}`
      });
      localStorage.setItem('currentUser', JSON.stringify({ username }));
      return true;
    }
    return false;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
      return false; // 用户名已存在
    }
    const hashedPassword = hashPassword(password);
    users.push({ username, password: hashedPassword });
    saveUsers(users);
    
    // 注册成功后自动登录
    setUser({
      isLogin: true,
      name: username,
      avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${encodeURIComponent(username)}`
    });
    localStorage.setItem('currentUser', JSON.stringify({ username }));
    return true;
  };

  const logout = () => {
    setUser({ isLogin: false });
    localStorage.removeItem('currentUser');
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext)!; 