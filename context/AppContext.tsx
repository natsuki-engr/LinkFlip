import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useColorScheme, Platform } from 'react-native';
import * as nfcEmitter from '@/services/nfcEmitter';
import {
  UserProfile,
  SNSCard,
  AppSettings,
  ColorScheme,
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
} from '@/types';
import {
  loadProfile,
  saveProfile,
  loadSettings,
  saveSettings,
  generateId,
} from '@/utils/storage';

interface AppContextType {
  // Profile state
  profile: UserProfile;
  isLoading: boolean;

  // Settings state
  settings: AppSettings;

  // Theme
  isDarkMode: boolean;
  colorScheme: 'light' | 'dark';

  // Profile actions
  updateProfile: (updates: Partial<Pick<UserProfile, 'name' | 'bio' | 'profileImage'>>) => Promise<void>;

  // SNS Card actions
  addCard: (card: Omit<SNSCard, 'id' | 'order' | 'createdAt'>) => Promise<void>;
  updateCard: (id: string, updates: Partial<Omit<SNSCard, 'id' | 'createdAt'>>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  reorderCards: (cards: SNSCard[]) => Promise<void>;

  // Settings actions
  setColorScheme: (scheme: ColorScheme) => Promise<void>;

  // NFC state (Android only)
  nfcEnabled: boolean;
  nfcAvailable: boolean;
  setNfcEnabled: (enabled: boolean) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const systemColorScheme = useColorScheme();

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [nfcAvailable, setNfcAvailable] = useState(false);

  // Determine effective color scheme
  const effectiveColorScheme =
    settings.colorScheme === 'system'
      ? (systemColorScheme ?? 'light')
      : settings.colorScheme;

  const isDarkMode = effectiveColorScheme === 'dark';

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedProfile, loadedSettings] = await Promise.all([
          loadProfile(),
          loadSettings(),
        ]);
        setProfile(loadedProfile);
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Check NFC hardware availability (Android only)
  useEffect(() => {
    if (Platform.OS === 'android') {
      nfcEmitter.checkNfcAvailable().then(setNfcAvailable);
    }
  }, []);

  // Sync NFC state when settings load
  useEffect(() => {
    if (nfcAvailable && settings.nfcEnabled) {
      nfcEmitter.setNfcEnabled(true);
    }
  }, [nfcAvailable]);

  // Update profile
  const updateProfile = useCallback(
    async (updates: Partial<Pick<UserProfile, 'name' | 'bio' | 'profileImage'>>) => {
      const newProfile = { ...profile, ...updates, updatedAt: Date.now() };
      setProfile(newProfile);
      await saveProfile(newProfile);
    },
    [profile]
  );

  // Add new card
  const addCard = useCallback(
    async (cardData: Omit<SNSCard, 'id' | 'order' | 'createdAt'>) => {
      const newCard: SNSCard = {
        ...cardData,
        id: generateId(),
        order: profile.snsCards.length,
        createdAt: Date.now(),
      };
      const newProfile = {
        ...profile,
        snsCards: [...profile.snsCards, newCard],
        updatedAt: Date.now(),
      };
      setProfile(newProfile);
      await saveProfile(newProfile);
    },
    [profile]
  );

  // Update existing card
  const updateCard = useCallback(
    async (id: string, updates: Partial<Omit<SNSCard, 'id' | 'createdAt'>>) => {
      const newCards = profile.snsCards.map((card) =>
        card.id === id ? { ...card, ...updates } : card
      );
      const newProfile = {
        ...profile,
        snsCards: newCards,
        updatedAt: Date.now(),
      };
      setProfile(newProfile);
      await saveProfile(newProfile);
    },
    [profile]
  );

  // Delete card
  const deleteCard = useCallback(
    async (id: string) => {
      const newCards = profile.snsCards
        .filter((card) => card.id !== id)
        .map((card, index) => ({ ...card, order: index }));
      const newProfile = {
        ...profile,
        snsCards: newCards,
        updatedAt: Date.now(),
      };
      setProfile(newProfile);
      await saveProfile(newProfile);
    },
    [profile]
  );

  // Reorder cards
  const reorderCards = useCallback(
    async (cards: SNSCard[]) => {
      const newCards = cards.map((card, index) => ({ ...card, order: index }));
      const newProfile = {
        ...profile,
        snsCards: newCards,
        updatedAt: Date.now(),
      };
      setProfile(newProfile);
      await saveProfile(newProfile);
    },
    [profile]
  );

  // Set color scheme
  const setColorSchemeValue = useCallback(
    async (scheme: ColorScheme) => {
      const newSettings = { ...settings, colorScheme: scheme };
      setSettings(newSettings);
      await saveSettings(newSettings);
    },
    [settings]
  );

  // Set NFC enabled
  const setNfcEnabledValue = useCallback(
    async (enabled: boolean) => {
      const newSettings = { ...settings, nfcEnabled: enabled };
      setSettings(newSettings);
      await saveSettings(newSettings);
      await nfcEmitter.setNfcEnabled(enabled);
    },
    [settings]
  );

  const value: AppContextType = {
    profile,
    isLoading,
    settings,
    isDarkMode,
    colorScheme: effectiveColorScheme,
    updateProfile,
    addCard,
    updateCard,
    deleteCard,
    reorderCards,
    setColorScheme: setColorSchemeValue,
    nfcEnabled: settings.nfcEnabled,
    nfcAvailable,
    setNfcEnabled: setNfcEnabledValue,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Convenience hooks
export function useProfile() {
  const { profile, updateProfile, isLoading } = useApp();
  return { profile, updateProfile, isLoading };
}

export function useCards() {
  const { profile, addCard, updateCard, deleteCard, reorderCards } = useApp();
  return {
    cards: profile.snsCards,
    addCard,
    updateCard,
    deleteCard,
    reorderCards,
  };
}

export function useTheme() {
  const { isDarkMode, colorScheme, settings, setColorScheme } = useApp();
  return { isDarkMode, colorScheme, settings, setColorScheme };
}

export function useNfc() {
  const { nfcEnabled, nfcAvailable, setNfcEnabled } = useApp();
  return { nfcEnabled, nfcAvailable, setNfcEnabled };
}
