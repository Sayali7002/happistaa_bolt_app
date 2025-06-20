export interface UserProfile {
  id: string;
  name: string;
  dateOfBirth: string;
  location: string;
  gender: string;
  workplace: string;
  jobTitle: string;
  education: string;
  religiousBeliefs: string;
  communicationPreferences: string;
  availability: string;
  completedSetup: boolean;
  profileCompletionPercentage: number;
  journey?: string;
  journeyNote?: string;
  supportPreferences?: string[];
  supportType?: string;
  certifications?: {
    status: 'pending' | 'approved' | 'rejected' | 'none';
  };
}

export interface PeerMatch {
  id: string;
  name: string;
  avatar: string;
  matchScore: number;
  supportPreferences: string[];
  supportType: 'support-giver' | 'support-seeker';
  location: string;
  isActive: boolean;
  rating: number;
  totalRatings: number;
  certifiedMentor: boolean;
  peopleSupported?: number;
  journeyNote?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string | Date;
  isAnonymous: boolean;
  senderId?: string;
  receiverId?: string;
}

export interface MindfulnessEntry {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  type: 'journal' | 'gratitude' | 'strength';
  content: string;
  mood?: string | null;
  category?: string | null;
  is_private: boolean;
  tags?: string[] | null;
}