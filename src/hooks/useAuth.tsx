
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error);
        return { error, data: null };
      }
      return { error: null, data: data.session };
    } catch (error) {
      const authError = error as AuthError;
      setError(authError);
      return { error: authError, data: null };
    }
  };

  const signInDemo = async (role: 'researcher' | 'administrator') => {
    const email = role === 'researcher' ? 'researcher@demo.vhv' : 'admin@demo.vhv';
    const password = role === 'researcher' ? 'Demo2025!' : 'Admin2025!';
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error);
        return { error, data: null };
      } else {
        setIsDemo(true);
        setDemoRole(role);
        return { error: null, data: data.session };
      }
    } catch (error) {
      const authError = error as AuthError;
      setError(authError);
      return { error: authError, data: null };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error);
        return { error };
      } else {
        setIsDemo(false);
        setDemoRole(null);
        return { error: null };
      }
    } catch (error) {
      const authError = error as AuthError;
      setError(authError);
      return { error: authError };
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
