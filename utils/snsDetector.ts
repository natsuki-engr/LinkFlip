import { SNSPlatform, PlatformInfo } from '@/types';
import { SNS_PLATFORMS, getAllPlatforms } from '@/constants/sns';

export interface DetectionResult {
  success: boolean;
  platform?: SNSPlatform;
  platformInfo?: PlatformInfo;
  username?: string;
  error?: string;
}

/**
 * Detect SNS platform from a URL
 * @param url - The URL to analyze
 * @returns DetectionResult with platform info if detected
 */
export function detectPlatformFromUrl(url: string): DetectionResult {
  // Validate URL format
  if (!url || typeof url !== 'string') {
    return {
      success: false,
      error: 'URLを入力してください',
    };
  }

  // Normalize URL
  let normalizedUrl = url.trim().toLowerCase();

  // Add https:// if missing
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  // Try to match against each platform's patterns
  const platforms = getAllPlatforms();

  for (const platformId of platforms) {
    const platformInfo = SNS_PLATFORMS[platformId];

    for (const pattern of platformInfo.urlPatterns) {
      if (pattern.test(normalizedUrl)) {
        const username = platformInfo.extractUsername(normalizedUrl);

        if (username) {
          return {
            success: true,
            platform: platformId,
            platformInfo,
            username,
          };
        }
      }
    }
  }

  return {
    success: false,
    error: 'サポートされていないプラットフォームです',
  };
}

/**
 * Format username with platform prefix
 * @param platform - The SNS platform
 * @param username - The raw username
 * @returns Formatted username with prefix
 */
export function formatUsername(platform: SNSPlatform, username: string): string {
  const platformInfo = SNS_PLATFORMS[platform];
  const prefix = platformInfo.usernamePrefix;

  // Don't double-prefix
  if (prefix && username.startsWith(prefix)) {
    return username;
  }

  return prefix + username;
}

/**
 * Normalize a URL (add https:// if missing)
 * @param url - The URL to normalize
 * @returns Normalized URL
 */
export function normalizeUrl(url: string): string {
  let normalizedUrl = url.trim();

  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  return normalizedUrl;
}

/**
 * Validate URL format
 * @param url - The URL to validate
 * @returns true if valid URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(normalizeUrl(url));
    return true;
  } catch {
    return false;
  }
}
