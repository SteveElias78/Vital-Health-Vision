import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define types for our auth context
interface AuthUser {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isInDemoMode: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{error: any | null, data: any}>;
  demoLogin: (role: 'researcher' | 'administrator') => Promise<{error: any | null, data: any}>;
  signOut: () => Promise<void>;
}

// Create context with default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for authentication
const DEMO_USERS = {
  'researcher@demo.vhv': {
    id: 'demo-researcher-id',
    email: 'researcher@demo.vhv',
    password: 'Demo2025!',
    role: 'researcher'
  },
  'admin@demo.vhv': {
    id: 'demo-admin-id',
    email: 'admin@demo.vhv',
    password: 'Admin2025!',
    role: 'administrator'
  }
};

// Provider component that wraps your app and makes auth available
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for saved auth on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('vhv-auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setUser(parsedAuth);
      } catch (e) {
        console.error('Failed to parse saved auth:', e);
        localStorage.removeItem('vhv-auth');
      }
    }
    setLoading(false);
  }, []);

  // Demo sign in function
  const signInWithEmail = async (email: string, password: string) => {
    // Simple demo authentication logic
    const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
    
    if (demoUser && demoUser.password === password) {
      const userData = {
        id: demoUser.id,
        email: demoUser.email,
        role: demoUser.role
      };
      
      setUser(userData);
      localStorage.setItem('vhv-auth', JSON.stringify(userData));
      
      return { error: null, data: userData };
    }
    
    return { 
      error: { message: 'Invalid email or password' }, 
      data: null 
    };
  };

  // Demo login for specific roles
  const demoLogin = async (role: 'researcher' | 'administrator') => {
    const email = role === 'researcher' ? 'researcher@demo.vhv' : 'admin@demo.vhv';
    const password = role === 'researcher' ? 'Demo2025!' : 'Admin2025!';
    
    return signInWithEmail(email, password);
  };

  // Sign out
  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('vhv-auth');
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isInDemoMode: !!user?.email?.includes('@demo.vhv'),
    signInWithEmail,
    demoLogin,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for components to get auth data and functions
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
