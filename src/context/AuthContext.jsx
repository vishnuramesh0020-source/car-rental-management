import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { DEMO_CREDENTIALS } from '../services/seedData';

export const AuthContext = createContext(null);

const USERS_STORAGE_KEY = 'car_rental_users_v1';
const CURRENT_USER_KEY = 'car_rental_current_user_v1';

const DEFAULT_USERS = [
  {
    id: 'usr-1',
    name: 'Eleanor Vance',
    email: 'admin@carrental.com',
    password: 'password123',
    role: 'Fleet Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2025-01-15'
  },
  {
    id: 'usr-2',
    name: 'Marcus Sterling',
    email: 'marcus@carrental.com',
    password: 'password123',
    role: 'Operations Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2025-03-22'
  }
];

export { DEMO_CREDENTIALS };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUserRaw = localStorage.getItem(CURRENT_USER_KEY);
      return savedUserRaw ? JSON.parse(savedUserRaw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Ensure default users list exists in localStorage
  useEffect(() => {
    try {
      const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existingUsersRaw) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      }
    } catch (err) {
      console.error('Error writing default users:', err);
    }
  }, []);

  const getUsers = () => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!foundUser) {
      setLoading(false);
      toast.error('Invalid email or password. Please try again.');
      throw new Error('Invalid email or password.');
    }

    const { password: _, ...sessionUser } = foundUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    setLoading(false);
    toast.success(`Welcome back, ${sessionUser.name}!`);
    return sessionUser;
  };

  const register = async (name, email, password) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      setLoading(false);
      toast.error('An account with this email address already exists.');
      throw new Error('Account already exists.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      role: 'Fleet Manager',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    const { password: _, ...sessionUser } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    setLoading(false);
    toast.success(`Account created successfully! Welcome, ${sessionUser.name}.`);
    return sessionUser;
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    toast.info('You have been logged out.');
  };

  const forgotPassword = async (email) => {
    await new Promise((res) => setTimeout(res, 500));
    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const userExists = users.some((u) => u.email.toLowerCase() === normalizedEmail);

    if (userExists) {
      toast.success(`Password reset instructions sent to ${email}`);
      return true;
    } else {
      toast.error('No account registered with this email address.');
      throw new Error('User not found.');
    }
  };

  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    const users = getUsers().map((u) =>
      u.id === user.id ? { ...u, ...updatedFields } : u
    );
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    toast.success('Profile updated successfully!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from './useAuth';
