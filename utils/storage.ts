import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AppSettings, DEFAULT_PROFILE, DEFAULT_SETTINGS } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  PROFILE: '@linkflip/profile',
  SETTINGS: '@linkflip/settings',
} as const;

/**
 * Load user profile from storage
 * @returns UserProfile or default profile
 */
export async function loadProfile(): Promise<UserProfile> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    if (json) {
      return JSON.parse(json) as UserProfile;
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
  return { ...DEFAULT_PROFILE };
}

/**
 * Save user profile to storage
 * @param profile - UserProfile to save
 */
export async function saveProfile(profile: UserProfile): Promise<void> {
  try {
    const json = JSON.stringify({
      ...profile,
      updatedAt: Date.now(),
    });
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, json);
  } catch (error) {
    console.error('Failed to save profile:', error);
    throw error;
  }
}

/**
 * Load app settings from storage
 * @returns AppSettings or default settings
 */
export async function loadSettings(): Promise<AppSettings> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (json) {
      return JSON.parse(json) as AppSettings;
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return { ...DEFAULT_SETTINGS };
}

/**
 * Save app settings to storage
 * @param settings - AppSettings to save
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    const json = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, json);
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}

/**
 * Clear all storage (for debugging/testing)
 */
export async function clearAllStorage(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.PROFILE, STORAGE_KEYS.SETTINGS]);
  } catch (error) {
    console.error('Failed to clear storage:', error);
    throw error;
  }
}

/**
 * Generate a unique ID
 * @returns Unique ID string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
