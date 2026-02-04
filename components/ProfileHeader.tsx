import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useProfile, useTheme } from '@/context/AppContext';
import { Colors, Typography, Shadows } from '@/constants/theme';
import { IconButton } from './ui/IconButton';

export function ProfileHeader() {
  const router = useRouter();
  const { profile } = useProfile();
  const { isDarkMode } = useTheme();

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.spacer} />
        <IconButton onPress={handleSettingsPress} variant="glass">
          <Svg width={22} height={22} viewBox="0 0 24 24" fill={isDarkMode ? Colors.dark.text : Colors.light.text}>
            <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </Svg>
        </IconButton>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {profile.profileImage ? (
            <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, isDarkMode ? styles.avatarPlaceholderDark : styles.avatarPlaceholderLight]}>
              <Svg width={48} height={48} viewBox="0 0 24 24" fill={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}>
                <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </Svg>
            </View>
          )}
        </View>

        <Text style={[styles.name, isDarkMode ? styles.textDark : styles.textLight]}>
          {profile.name}
        </Text>

        <Text
          style={[styles.bio, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}
          numberOfLines={2}
        >
          {profile.bio}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  spacer: {
    width: 44,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 12,
    ...Shadows.elevation2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderLight: {
    backgroundColor: Colors.light.glass80,
    borderWidth: 1,
    borderColor: Colors.light.glassBorder,
  },
  avatarPlaceholderDark: {
    backgroundColor: Colors.dark.glass80,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  name: {
    fontSize: Typography.title.fontSize,
    fontWeight: '700',
    marginBottom: 4,
  },
  bio: {
    fontSize: Typography.body.fontSize,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  textLight: {
    color: Colors.light.text,
  },
  textDark: {
    color: Colors.dark.text,
  },
  textSecondaryLight: {
    color: Colors.light.textSecondary,
  },
  textSecondaryDark: {
    color: Colors.dark.textSecondary,
  },
});
