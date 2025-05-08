
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Email of the demo user
const DEMO_EMAIL = 'demo@vitalhealthvision.org';

/**
 * Hook to detect if the current user is using demo mode
 * @returns Object with isDemoMode boolean indicating if user is in demo mode
 */
export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDemoMode = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email === DEMO_EMAIL) {
          setIsDemoMode(true);
        } else {
          setIsDemoMode(false);
        }
      } catch (error) {
        console.error('Error checking demo mode:', error);
        setIsDemoMode(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkDemoMode();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && session.user.email === DEMO_EMAIL) {
        setIsDemoMode(true);
      } else {
        setIsDemoMode(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isDemoMode, isLoading };
}

export default useDemoMode;
