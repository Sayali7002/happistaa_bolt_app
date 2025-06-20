import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../config/supabase';
import { MindfulnessEntry } from '../types';

interface UseMindfulnessOptions {
  type?: 'journal' | 'gratitude' | 'strength';
  autoFetch?: boolean;
}

export function useMindfulness(options: UseMindfulnessOptions = {}) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MindfulnessEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch entries from Supabase
  const fetchEntries = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('mindfulness_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (options.type) {
        query = query.eq('type', options.type);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setEntries(data || []);
    } catch (err: any) {
      console.error('Error fetching mindfulness entries:', err);
      setError(err.message || 'Failed to fetch entries');
    } finally {
      setIsLoading(false);
    }
  }, [user, options.type]);
  
  // Create a new entry
  const createEntry = useCallback(async (entry: Omit<MindfulnessEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newEntry = {
        ...entry,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('mindfulness_entries')
        .insert(newEntry)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setEntries(prev => [data[0], ...prev]);
        return data[0];
      }
      
      return null;
    } catch (err: any) {
      console.error('Error creating mindfulness entry:', err);
      setError(err.message || 'Failed to create entry');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Update an existing entry
  const updateEntry = useCallback(async (id: string, updates: Partial<Omit<MindfulnessEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('mindfulness_entries')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setEntries(prev => prev.map(entry => entry.id === id ? data[0] : entry));
        return data[0];
      }
      
      return null;
    } catch (err: any) {
      console.error('Error updating mindfulness entry:', err);
      setError(err.message || 'Failed to update entry');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Delete an entry
  const deleteEntry = useCallback(async (id: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('mindfulness_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setEntries(prev => prev.filter(entry => entry.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting mindfulness entry:', err);
      setError(err.message || 'Failed to delete entry');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Helper functions for specific entry types
  
  // Journal entries
  const createJournalEntry = useCallback((content: string, mood: string, isPrivate: boolean = true, tags?: string[]) => {
    return createEntry({
      type: 'journal',
      content,
      mood,
      is_private: isPrivate,
      tags
    });
  }, [createEntry]);
  
  // Gratitude entries
  const createGratitudeEntry = useCallback((content: string, category: string, isPrivate: boolean = true) => {
    return createEntry({
      type: 'gratitude',
      content,
      category,
      is_private: isPrivate
    });
  }, [createEntry]);
  
  // Strength entries
  const createStrengthEntry = useCallback((content: string, category?: string, isPrivate: boolean = true) => {
    return createEntry({
      type: 'strength',
      content,
      category,
      is_private: isPrivate
    });
  }, [createEntry]);
  
  // Auto-fetch entries on mount if enabled
  useEffect(() => {
    if (options.autoFetch !== false && user) {
      fetchEntries();
    }
  }, [fetchEntries, options.autoFetch, user]);
  
  return {
    entries,
    isLoading,
    error,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    createJournalEntry,
    createGratitudeEntry,
    createStrengthEntry
  };
}