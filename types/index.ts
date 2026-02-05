// SNS Platform types
export type SNSPlatform =
  | 'twitter'
  | 'x'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'github'
  | 'tiktok'
  | 'facebook'
  | 'threads'
  | 'bluesky'
  | 'discord'
  | 'telegram'
  | 'whatsapp';

// SNS Card interface
export interface SNSCard {
  id: string;
  platform: SNSPlatform;
  username: string;
  url: string;
  order: number;
  createdAt: number;
  customImage?: string | null;
  useCustomImage: boolean;
}

// User Profile interface
export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  profileImage: string | null;
  snsCards: SNSCard[];
  updatedAt: number;
}

// QR Code Data interface
export interface QRCodeData {
  url: string;
  platform: SNSPlatform;
  username: string;
}

// Platform Info for display
export interface PlatformInfo {
  id: SNSPlatform;
  name: string;
  color: string;
  urlPatterns: RegExp[];
  usernamePrefix: string;
  extractUsername: (url: string) => string | null;
}

// Theme types
export type ColorScheme = 'light' | 'dark' | 'system';

// App Settings
export interface AppSettings {
  colorScheme: ColorScheme;
  nfcEnabled: boolean;
}

// Default values
export const DEFAULT_PROFILE: UserProfile = {
  id: 'default',
  name: 'Your Name',
  bio: 'Add your bio here',
  profileImage: null,
  snsCards: [],
  updatedAt: Date.now(),
};

export const DEFAULT_SETTINGS: AppSettings = {
  colorScheme: 'system',
  nfcEnabled: false,
};
