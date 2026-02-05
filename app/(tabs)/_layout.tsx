import { Tabs } from 'expo-router';
import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { Colors, Shadows } from '@/constants/theme';
import { useTheme, useNfc } from '@/context/AppContext';

function HomeIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </Svg>
  );
}

function SettingsIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </Svg>
  );
}

function NfcIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V8h3v8H8V8h2V6H8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
    </Svg>
  );
}

function NfcToggleButton() {
  const { nfcEnabled, nfcAvailable, setNfcEnabled } = useNfc();
  const { isDarkMode } = useTheme();

  if (!nfcAvailable) return null;

  const handleToggle = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setNfcEnabled(!nfcEnabled);
  };

  const iconColor = nfcEnabled
    ? Colors.primary.orange
    : isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary;

  return (
    <TouchableOpacity
      style={[
        styles.nfcButton,
        isDarkMode ? styles.nfcButtonDark : styles.nfcButtonLight,
        nfcEnabled && styles.nfcButtonActive,
      ]}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <NfcIcon size={22} color={iconColor} />
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const handleAddAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/add-account');
  };

  return (
    <View style={styles.tabBarWrapper}>
      {isHome && (
        <View style={styles.fabRow}>
          <View style={styles.fabSpacer} />
          <View style={styles.fabContainer}>
            <TouchableOpacity
              style={[styles.fab, Shadows.elevation3]}
              onPress={handleAddAccount}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[Colors.primary.orange, Colors.primary.gold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fabGradient}
              >
                <Svg width={28} height={28} viewBox="0 0 24 24" fill="#fff">
                  <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </Svg>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.nfcContainer}>
            {Platform.OS === 'android' && <NfcToggleButton />}
          </View>
        </View>
      )}
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: insets.bottom,
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderTopColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const color = isFocused
            ? Colors.primary.orange
            : isDarkMode
              ? Colors.dark.textSecondary
              : Colors.light.textSecondary;

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={onPress}
              activeOpacity={0.7}
            >
              {route.name === 'index' ? (
                <HomeIcon size={24} color={color} />
              ) : (
                <SettingsIcon size={24} color={color} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'ホーム' }} />
      <Tabs.Screen name="settings" options={{ title: '設定' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    alignItems: 'center',
  },
  fabRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: -28,
    zIndex: 1,
    paddingHorizontal: 16,
  },
  fabSpacer: {
    flex: 1,
  },
  fabContainer: {
    flex: 1,
    alignItems: 'center',
  },
  nfcContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcButtonLight: {
    backgroundColor: Colors.light.glass80,
    borderWidth: 1,
    borderColor: Colors.light.glassBorder,
  },
  nfcButtonDark: {
    backgroundColor: Colors.dark.glass80,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  nfcButtonActive: {
    borderColor: Colors.primary.orange,
    borderWidth: 1.5,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
});
