import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/context/AppContext';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  intensity?: number;
  noPadding?: boolean;
}

export function GlassCard({ children, style, intensity = 80, noPadding = false }: GlassCardProps) {
  const { isDarkMode } = useTheme();

  const containerStyle = [
    styles.container,
    isDarkMode ? styles.containerDark : styles.containerLight,
    isDarkMode ? Shadows.glassDark : Shadows.glass,
    !noPadding && styles.padding,
    style,
  ];

  // BlurView doesn't work well on Android, use fallback
  if (Platform.OS === 'android') {
    return (
      <View style={[containerStyle, isDarkMode ? styles.androidDark : styles.androidLight]}>
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={isDarkMode ? 'dark' : 'light'}
      style={containerStyle}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
  },
  containerLight: {
    backgroundColor: Colors.light.glass60,
    borderWidth: 1,
    borderColor: Colors.light.glassBorder,
  },
  containerDark: {
    backgroundColor: Colors.dark.glass60,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  padding: {
    padding: 16,
  },
  androidLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  androidDark: {
    backgroundColor: 'rgba(30, 28, 24, 0.9)',
  },
});
