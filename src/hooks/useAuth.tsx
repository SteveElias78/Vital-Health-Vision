
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError } from '@supabase/supabase-js';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  demoRole: 'researcher' | 'administrator' | null;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: Session | null;
  }>;
  signInDemo: (role: 'researcher' | 'administrator') => Promise<{
    error: AuthError | null;
    data: Session | null;
  }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [demoRole, setDemoRole] = useState<'researcher' | 'administrator' | null>(null);

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check if this is a demo user
        const email = session?.user?.email;
        if (email === 'researcher@demo.vhv') {
          setIsDemo(true);
          setDemoRole('researcher');
        } else if (email === 'admin@demo.vhv') {
          setIsDemo(true);
          setDemoRole('administrator');
        } else {
          setIsDemo(false);
          setDemoRole(null);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if this is a demo user
      const email = session?.user?.email;
      if (email === 'researcher@demo.vhv') {
        setIsDemo(true);
        setDemoRole('researcher');
      } else if (email === 'admin@demo.vhv') {
        setIsDemo(true);
        setDemoRole('administrator');
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        setError(result.error);
      }
      return result;
    } catch (error) {
      setError(error as AuthError);
      return { error: error as AuthError, data: null };
    }
  };

  const signInDemo = async (role: 'researcher' | 'administrator') => {
    const email = role === 'researcher' ? 'researcher@demo.vhv' : 'admin@demo.vhv';
    const password = role === 'researcher' ? 'Demo2025!' : 'Admin2025!';
    
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        setError(result.error);
      } else {
        setIsDemo(true);
        setDemoRole(role);
      }
      return result;
    } catch (error) {
      setError(error as AuthError);
      return { error: error as AuthError, data: null };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error);
      } else {
        setIsDemo(false);
        setDemoRole(null);
      }
      return { error };
    } catch (error) {
      setError(error as AuthError);
      return { error: error as AuthError };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isDemo,
        demoRole,
        signIn,
        signInDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
