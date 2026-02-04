import { SNSPlatform, PlatformInfo } from '@/types';

// SNS Platform configurations
export const SNS_PLATFORMS: Record<SNSPlatform, PlatformInfo> = {
  twitter: {
    id: 'twitter',
    name: 'Twitter',
    color: '#1DA1F2',
    urlPatterns: [/twitter\.com\/([^/?]+)/, /x\.com\/([^/?]+)/],
    usernamePrefix: '@',
    extractUsername: (url: string) => {
      const match = url.match(/(?:twitter|x)\.com\/([^/?]+)/);
      return match ? match[1] : null;
    },
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    urlPatterns: [/instagram\.com\/([^/?]+)/],
    usernamePrefix: '@',
    extractUsername: (url: string) => {
      const match = url.match(/instagram\.com\/([^/?]+)/);
      return match ? match[1] : null;
    },
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    urlPatterns: [/linkedin\.com\/in\/([^/?]+)/],
    usernamePrefix: '',
    extractUsername: (url: string) => {
      const match = url.match(/linkedin\.com\/in\/([^/?]+)/);
      return match ? match[1] : null;
    },
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    urlPatterns: [/youtube\.com\/@([^/?]+)/, /youtube\.com\/channel\/([^/?]+)/],
    usernamePrefix: '@',
    extractUsername: (url: string) => {
      const match = url.match(/youtube\.com\/@([^/?]+)/);
      if (match) return match[1];
      const channelMatch = url.match(/youtube\.com\/channel\/([^/?]+)/);
      return channelMatch ? channelMatch[1] : null;
    },
  },
  github: {
    id: 'github',
    name: 'GitHub',
    color: '#181717',
    urlPatterns: [/github\.com\/([^/?]+)/],
    usernamePrefix: '',
    extractUsername: (url: string) => {
      const match = url.match(/github\.com\/([^/?]+)/);
      return match ? match[1] : null;
    },
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    color: '#000000',
    urlPatterns: [/tiktok\.com\/@([^/?]+)/],
    usernamePrefix: '@',
    extractUsername: (url: string) => {
      const match = url.match(/tiktok\.com\/@([^/?]+)/);
      return match ? match[1] : null;
    },
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    urlPatterns: [/facebook\.com\/([^/?]+)/],
    usernamePrefix: '',
    extractUsername: (url: string) => {
      const match = url.match(/facebook\.com\/([^/?]+)/);
      return match ? match[1] : null;
    },
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    color: '#000000',
    urlPatterns: [/threads\.net\/@([^/?]+)/],
    usernamePrefix: '@',
    extractUsername: (url: string) => {
      const match = url.match(/threads\.net\/@([^/?]+)/);
      return match ? match[1] : null;
    },
  },
  bluesky: {
    id: 'bluesky',
    name: 'Bluesky',
    color: '#0085FF',
    urlPatterns: [/bsky\.app\/profile\/([^/?]+)/],
    usernamePrefix: '@',
    extractUsername: (url: string) => {
      const match = url.match(/bsky\.app\/profile\/([^/?]+)/);
      return match ? match[1] : null;
    },
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    color: '#5865F2',
    urlPatterns: [/discord\.gg\/([^/?]+)/, /discord\.com\/invite\/([^/?]+)/],
    usernamePrefix: '',
    extractUsername: (url: string) => {
      const match = url.match(/discord\.(?:gg|com\/invite)\/([^/?]+)/);
      return match ? match[1] : null;
    },
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    color: '#26A5E4',
    urlPatterns: [/t\.me\/([^/?]+)/],
    usernamePrefix: '@',
    extractUsername: (url: string) => {
      const match = url.match(/t\.me\/([^/?]+)/);
      return match ? match[1] : null;
    },
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    urlPatterns: [/wa\.me\/([^/?]+)/],
    usernamePrefix: '+',
    extractUsername: (url: string) => {
      const match = url.match(/wa\.me\/([^/?]+)/);
      return match ? match[1] : null;
    },
  },
};

// Get platform info by ID
export const getPlatformInfo = (platform: SNSPlatform): PlatformInfo => {
  return SNS_PLATFORMS[platform];
};

// Get all platform IDs
export const getAllPlatforms = (): SNSPlatform[] => {
  return Object.keys(SNS_PLATFORMS) as SNSPlatform[];
};
