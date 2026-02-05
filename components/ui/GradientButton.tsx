import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, BorderRadius, Typography, Animations } from '@/constants/theme';
import { useTheme } from '@/context/AppContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function GradientButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: GradientButtonProps) {
  const { isDarkMode } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(Animations.button.scale, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizeStyles = {
    small: styles.sizeSmall,
    medium: styles.sizeMedium,
    large: styles.sizeLarge,
  };

  const textSizeStyles = {
    small: styles.textSmall,
    medium: styles.textMedium,
    large: styles.textLarge,
  };

  const gradientColors: [string, string] =
    variant === 'primary'
      ? [Colors.primary.orange, Colors.primary.gold]
      : [Colors.primary.gold, Colors.primary.light];

  if (variant === 'outline') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          animatedStyle,
          styles.outlineButton,
          sizeStyles[size],
          isDarkMode ? styles.outlineButtonDark : styles.outlineButtonLight,
          disabled && styles.disabled,
          style,
        ]}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={isDarkMode ? Colors.dark.text : Colors.light.text} />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.text,
                textSizeStyles[size],
                isDarkMode ? styles.textDark : styles.textLight,
                icon ? styles.textWithIcon : null,
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[animatedStyle, disabled && styles.disabled, style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, sizeStyles[size]]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon}
            <Text style={[styles.text, styles.textGradient, textSizeStyles[size], icon ? styles.textWithIcon : null, textStyle]}>
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  outlineButton: {
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1.5,
  },
  outlineButtonLight: {
    borderColor: Colors.primary.orange,
    backgroundColor: 'transparent',
  },
  outlineButtonDark: {
    borderColor: Colors.primary.gold,
    backgroundColor: 'transparent',
  },
  sizeSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sizeMedium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  sizeLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 12,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 16,
  },
  textGradient: {
    color: '#fff',
  },
  textLight: {
    color: Colors.primary.deep,
  },
  textDark: {
    color: Colors.primary.gold,
  },
  textWithIcon: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
