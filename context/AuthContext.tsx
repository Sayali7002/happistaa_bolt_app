import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase';
import { UserProfile } from '@/types';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: UserProfile | null;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<UserProfile | null>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom storage implementation using Expo SecureStore for native platforms
const createSecureStorage = () => {
  if (Platform.OS === 'web') {
    // For web, use localStorage
    return {
      getItem: async (key: string) => {
        return localStorage.getItem(key);
      },
      setItem: async (key: string, value: string) => {
        localStorage.setItem(key, value);
      },
      removeItem: async (key: string) => {
        localStorage.removeItem(key);
      },
    };
  } else {
    // For native platforms, use SecureStore
    return {
      getItem: (key: string) => {
        return SecureStore.getItemAsync(key);
      },
      setItem: (key: string, value: string) => {
        return SecureStore.setItemAsync(key, value);
      },
      removeItem: (key: string) => {
        return SecureStore.deleteItemAsync(key);
      },
    };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Error getting auth session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
      });
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
        return null;
      }

      if (profile) {
        const mappedProfile: UserProfile = {
          id: profile.id,
          name: profile.name || '',
          dateOfBirth: profile.dob || '',
          location: profile.location || '',
          gender: profile.gender || '',
          workplace: profile.workplace || '',
          jobTitle: profile.job_title || '',
          education: profile.education || '',
          religiousBeliefs: profile.religious_beliefs || '',
          communicationPreferences: profile.communication_style || '',
          availability: profile.availability || '',
          completedSetup: profile.completed_setup || false,
          profileCompletionPercentage: calculateProfileCompletionPercentage(profile),
          journey: profile.support_preferences?.[0] || '',
          supportPreferences: profile.support_preferences || [],
          supportType: profile.support_type || '',
          journeyNote: profile.journey_note || '',
          certifications: {
            status: 'none'
          }
        };
        
        return mappedProfile;
      }

      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const updateUserProfile = async (profileUpdates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedProfile = { ...userProfile, ...profileUpdates };
      setUserProfile(updatedProfile as UserProfile);
      
      const supabaseData: any = {};
      
      if (profileUpdates.name !== undefined) supabaseData.name = profileUpdates.name;
      if (profileUpdates.dateOfBirth !== undefined) supabaseData.dob = profileUpdates.dateOfBirth;
      if (profileUpdates.location !== undefined) supabaseData.location = profileUpdates.location;
      if (profileUpdates.gender !== undefined) supabaseData.gender = profileUpdates.gender;
      if (profileUpdates.workplace !== undefined) supabaseData.workplace = profileUpdates.workplace;
      if (profileUpdates.jobTitle !== undefined) supabaseData.job_title = profileUpdates.jobTitle;
      if (profileUpdates.education !== undefined) supabaseData.education = profileUpdates.education;
      if (profileUpdates.religiousBeliefs !== undefined) supabaseData.religious_beliefs = profileUpdates.religiousBeliefs;
      if (profileUpdates.communicationPreferences !== undefined) supabaseData.communication_style = profileUpdates.communicationPreferences;
      if (profileUpdates.availability !== undefined) supabaseData.availability = profileUpdates.availability;
      if (profileUpdates.supportType !== undefined) supabaseData.support_type = profileUpdates.supportType;
      if (profileUpdates.supportPreferences !== undefined) supabaseData.support_preferences = profileUpdates.supportPreferences;
      if (profileUpdates.journeyNote !== undefined) supabaseData.journey_note = profileUpdates.journeyNote;
      if (profileUpdates.completedSetup !== undefined) supabaseData.completed_setup = profileUpdates.completedSetup;
      
      supabaseData.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('profiles')
        .update(supabaseData)
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating profile in Supabase:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };

  const calculateProfileCompletionPercentage = (profile: any): number => {
    const fields = [
      'name', 'dob', 'location', 'gender', 'workplace', 'job_title', 
      'education', 'religious_beliefs', 'communication_style', 'availability'
    ];
    
    let filledCount = 0;
    let totalFields = fields.length;
    
    fields.forEach(field => {
      if (profile[field]) filledCount++;
    });
    
    return Math.round((filledCount / totalFields) * 100);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        userProfile,
        signUp,
        signIn,
        signOut,
        fetchUserProfile,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };