import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/AppContext';
import { Colors, BorderRadius, Typography, Shadows } from '@/constants/theme';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export function Toast({
  message,
  visible,
  onHide,
  duration = 2000,
  type = 'success',
}: ToastProps) {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });

      // Auto hide after duration
      const hideTimer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(-20, { duration: 200 });
        setTimeout(onHide, 200);
      }, duration);

      return () => clearTimeout(hideTimer);
    }
  }, [visible, duration, onHide]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'error':
        return Colors.error;
      case 'warning':
        return Colors.warning;
      case 'info':
        return Colors.info;
      default:
        return Colors.success;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { top: insets.top + 16 },
        isDarkMode ? styles.containerDark : styles.containerLight,
        Shadows.elevation2,
      ]}
    >
      <Text
        style={[
          styles.icon,
          { color: getTypeColor() },
        ]}
      >
        {type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '!' : 'i'}
      </Text>
      <Text
        style={[
          styles.message,
          isDarkMode ? styles.messageDark : styles.messageLight,
        ]}
        numberOfLines={2}
      >
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: BorderRadius.button,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
  },
  containerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  containerDark: {
    backgroundColor: 'rgba(30, 28, 24, 0.95)',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  icon: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: Typography.body.fontSize,
  },
  messageLight: {
    color: Colors.light.text,
  },
  messageDark: {
    color: Colors.dark.text,
  },
});
