import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'student';

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userData = users[username];

    if (!userData || userData.password !== password) {
      throw new Error('Invalid username or password');
    }

    const userObj: User = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
    };
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
  };

  const register = async (username: string, email: string, password: string, role: UserRole) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username]) {
      throw new Error('Username already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      role,
    };

    users[username] = newUser;
    localStorage.setItem('users', JSON.stringify(users));

    const userObj: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
