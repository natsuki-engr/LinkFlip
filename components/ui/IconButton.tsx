import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/context/AppContext';
import { Colors, Shadows } from '@/constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface IconButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  size?: number;
  variant?: 'default' | 'glass' | 'primary';
  disabled?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  onPress,
  children,
  size = 44,
  variant = 'default',
  disabled = false,
  style,
}: IconButtonProps) {
  const { isDarkMode } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'glass':
        return isDarkMode ? styles.glassDark : styles.glassLight;
      case 'primary':
        return styles.primary;
      default:
        return {};
    }
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        styles.container,
        { width: size, height: size },
        getVariantStyle(),
        variant === 'glass' && (isDarkMode ? Shadows.elevation1 : Shadows.elevation1),
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {children}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  glassLight: {
    backgroundColor: Colors.light.glass80,
    borderWidth: 1,
    borderColor: Colors.light.glassBorder,
  },
  glassDark: {
    backgroundColor: Colors.dark.glass80,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  primary: {
    backgroundColor: Colors.primary.orange,
  },
  disabled: {
    opacity: 0.5,
  },
});
