import { describe, it, expect } from 'vitest';
import { supabase } from '../src/integrations/supabase/client';

describe('Supabase Integration', () => {
  it('should connect to Supabase successfully', () => {
    expect(supabase).toBeDefined();
  });

  it('should fetch analysis results', async () => {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .order('created_at', { ascending: false });

    expect(error).toBeNull();
    expect(data).toBeInstanceOf(Array);
  });
});