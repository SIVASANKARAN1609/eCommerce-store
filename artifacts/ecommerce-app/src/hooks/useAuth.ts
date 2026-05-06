import { useState, useCallback } from 'react';

export interface User {
  name: string;
  email: string;
  password?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('shopvibe_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email: string, password?: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('shopvibe_users') || '[]');
    const foundUser = users.find(u => u.email === email);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('shopvibe_user', JSON.stringify(userWithoutPassword));
      return true;
    }

    const name = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim() || 'User';
    const newUser: User = { name, email, password };
    users.push(newUser);
    localStorage.setItem('shopvibe_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('shopvibe_user', JSON.stringify(userWithoutPassword));
    return true;
  }, []);

  const signup = useCallback((name: string, email: string, password?: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('shopvibe_users') || '[]');
    if (users.find(u => u.email === email)) {
      const existingUser = users.find(u => u.email === email)!;
      const { password: _, ...userWithoutPassword } = existingUser;
      setUser(userWithoutPassword);
      localStorage.setItem('shopvibe_user', JSON.stringify(userWithoutPassword));
      return true;
    }

    const newUser: User = { name, email, password };
    users.push(newUser);
    localStorage.setItem('shopvibe_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('shopvibe_user', JSON.stringify(userWithoutPassword));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('shopvibe_user');
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout
  };
}
