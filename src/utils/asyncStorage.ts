import AsyncStorage from '@react-native-async-storage/async-storage';

// User profile storage
export const storeUserProfile = async (profile: any) => {
  try {
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error storing user profile:', error);
    return false;
  }
};

export const getUserProfile = async () => {
  try {
    const profileJson = await AsyncStorage.getItem('userProfile');
    return profileJson ? JSON.parse(profileJson) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Support preferences storage
export const storeSupportPreferences = async (preferences: string[]) => {
  try {
    await AsyncStorage.setItem('supportPreferences', JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error storing support preferences:', error);
    return false;
  }
};

export const getSupportPreferences = async () => {
  try {
    const preferencesJson = await AsyncStorage.getItem('supportPreferences');
    return preferencesJson ? JSON.parse(preferencesJson) : [];
  } catch (error) {
    console.error('Error getting support preferences:', error);
    return [];
  }
};

// Support type storage
export const storeSupportType = async (type: string) => {
  try {
    await AsyncStorage.setItem('supportType', type);
    return true;
  } catch (error) {
    console.error('Error storing support type:', error);
    return false;
  }
};

export const getSupportType = async () => {
  try {
    return await AsyncStorage.getItem('supportType');
  } catch (error) {
    console.error('Error getting support type:', error);
    return null;
  }
};

// Journey note storage
export const storeJourneyNote = async (note: string) => {
  try {
    await AsyncStorage.setItem('journeyNote', note);
    return true;
  } catch (error) {
    console.error('Error storing journey note:', error);
    return false;
  }
};

export const getJourneyNote = async () => {
  try {
    return await AsyncStorage.getItem('journeyNote');
  } catch (error) {
    console.error('Error getting journey note:', error);
    return null;
  }
};

// Clear all storage
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};