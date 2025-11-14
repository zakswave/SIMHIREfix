import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  headline?: string;
  role: 'candidate' | 'company' | 'admin';
  avatarColor?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
  companyName?: string;
  profile?: any;
  verification?: any;
  social?: {
    linkedin?: string;
    github?: string;
    dribbble?: string;
  };
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: 'id' | 'en';
  profileVisibility: 'public' | 'private' | 'connections';
  dataSharing: boolean;
}

interface UserContextValue {
  user: UserProfile | null;
  settings: UserSettings;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: FormData) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateSettings: (data: Partial<UserSettings>) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  mockLogin: () => void;
  mockCompanyLogin: () => void;
  setUser: (user: UserProfile | null) => void;
}

const defaultSettings: UserSettings = {
  emailNotifications: true,
  pushNotifications: false,
  language: 'id',
  profileVisibility: 'public',
  dataSharing: true,
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const hasInitialized = useRef(false);

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem('simhire_settings');
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          console.log('[UserContext] Checking current user...');
          const response = await api.getCurrentUser();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
            console.log('[UserContext] User loaded:', response.data.user.email);
          }
        } catch (error) {
          console.error('[UserContext] Failed to get current user:', error);
          api.clearToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);
  useEffect(() => {
    localStorage.setItem('simhire_settings', JSON.stringify(settings));
  }, [settings]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.login(email, password);

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        toast.success('Login berhasil!');
      } else {
        throw new Error(response.message || 'Login gagal');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login gagal');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData: FormData) => {
    try {
      setLoading(true);
      const response = await api.register(formData);

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        toast.success('Registrasi berhasil!');
      } else {
        throw new Error(response.message || 'Registrasi gagal');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registrasi gagal');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setUser((prev: UserProfile | null) => (prev ? { ...prev, ...data } : prev));
  }, []);

  const updateSettings = useCallback((data: Partial<UserSettings>) => {
    setSettings((prev: UserSettings) => ({ ...prev, ...data }));
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      api.clearToken();
      toast.success('Logout berhasil');
      window.location.href = '/';
    }
  }, []);

  const mockLogin = useCallback(() => {
    setUser({
      id: 'u123',
      name: 'Alexandria Putri',
      email: 'alexandria@example.com',
      headline: 'Product Designer & UX Researcher',
      role: 'candidate',
      avatarColor: 'bg-orange-400',
      bio: 'Bersemangat menciptakan pengalaman digital yang inklusif dan berdampak.',
      location: 'Bandung, Indonesia',
      website: 'https://alexdesign.com',
      skills: ['UI/UX', 'Figma', 'Prototyping', 'Research'],
      social: { linkedin: 'alexandria-putri', github: 'alexdev', dribbble: 'alexdesign' }
    });
  }, []);

  const mockCompanyLogin = useCallback(() => {
    setUser({
      id: 'c456',
      name: 'PT TechStart Indonesia',
      email: 'hr@techstart.id',
      headline: 'Leading Technology Company',
      role: 'company',
      avatarColor: 'bg-blue-500',
      bio: 'Membangun solusi teknologi inovatif untuk transformasi digital Indonesia.',
      location: 'Jakarta, Indonesia',
      website: 'https://techstart.id',
      skills: ['React', 'Node.js', 'DevOps', 'UI/UX', 'Data Science'],
      social: { linkedin: 'techstart-indonesia', github: 'techstart-id' }
    });
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      settings, 
      loading,
      login,
      register,
      updateProfile, 
      updateSettings, 
      logout,
      refreshUser,
      mockLogin, 
      mockCompanyLogin,
      setUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
