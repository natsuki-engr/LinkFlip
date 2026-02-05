import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { SNSCard as SNSCardType } from '@/types';
import { getPlatformInfo } from '@/constants/sns';
import { formatUsername } from '@/utils/snsDetector';
import { useTheme } from '@/context/AppContext';
import { Colors, BorderRadius, Shadows, Animations, CardDimensions } from '@/constants/theme';
import { SNSIcon } from './ui/SNSIcon';
import { QRCodeView } from './QRCodeView';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface SNSCardProps {
  card: SNSCardType;
}

// Calculate card width based on screen width (2 columns with padding and gap)
const SCREEN_PADDING = 16;
const CARD_GAP = 16;
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - SCREEN_PADDING * 2 - CARD_GAP) / 2;
const cardHeight = CardDimensions.height + 40;
// QR size: card height - padding(8*2) - platformName(~17) - username(~14) - gaps(~6)
const qrSize = Math.min(cardWidth - 16, cardHeight - 53);

export function SNSCard({ card }: SNSCardProps) {
  const { isDarkMode } = useTheme();
  const platformInfo = getPlatformInfo(card.platform);
  const formattedUsername = formatUsername(card.platform, card.username);

  const [isFlipped, setIsFlipped] = useState(false);
  const flipProgress = useSharedValue(0);
  const scale = useSharedValue(1);
  const autoFlipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto flip back after 5 seconds
  useEffect(() => {
    if (isFlipped) {
      autoFlipTimer.current = setTimeout(() => {
        handleFlipBack();
      }, 5000);
    }

    return () => {
      if (autoFlipTimer.current) {
        clearTimeout(autoFlipTimer.current);
      }
    };
  }, [isFlipped]);

  const handleFlip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFlipped(true);
    flipProgress.value = withTiming(1, {
      duration: Animations.flip.duration,
      easing: Easing.out(Easing.ease),
    });
  };

  const handleFlipBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFlipped(false);
    flipProgress.value = withTiming(0, {
      duration: Animations.flip.duration,
      easing: Easing.out(Easing.ease),
    });
    if (autoFlipTimer.current) {
      clearTimeout(autoFlipTimer.current);
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(Animations.press.scale, { damping: 25, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 25, stiffness: 300 });
  };

  // Front face animation
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);
    return {
      transform: [
        { perspective: 1200 },
        { rotateY: `${rotateY}deg` },
        { scale: scale.value },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  // Back face animation
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [180, 360]);
    return {
      transform: [
        { perspective: 1200 },
        { rotateY: `${rotateY}deg` },
        { scale: scale.value },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      {/* Front Face */}
      <View pointerEvents={isFlipped ? 'none' : 'auto'} style={StyleSheet.absoluteFill}>
        <AnimatedTouchable
          onPress={handleFlip}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.card,
            frontAnimatedStyle,
            isDarkMode ? styles.cardDark : styles.cardLight,
            isDarkMode ? Shadows.glassDark : Shadows.glass,
            Platform.OS === 'android' && { elevation: 0 },
          ]}
          activeOpacity={1}
        >
          <View style={styles.cardContent}>
            {card.useCustomImage && card.customImage ? (
              <Image source={{ uri: card.customImage }} style={styles.customImage} />
            ) : (
              <View style={[styles.iconContainer, { backgroundColor: platformInfo.color + '15' }]}>
                <SNSIcon platform={card.platform} size={CardDimensions.iconSize} />
              </View>
            )}
            <Text
              style={[styles.platformName, isDarkMode ? styles.textDark : styles.textLight]}
              numberOfLines={1}
            >
              {platformInfo.name}
            </Text>
            <Text
              style={[styles.username, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}
              numberOfLines={1}
            >
              {formattedUsername}
            </Text>
          </View>
        </AnimatedTouchable>
      </View>

      {/* Back Face (QR Code) */}
      <View pointerEvents={isFlipped ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            backAnimatedStyle,
            isDarkMode ? styles.cardDark : styles.cardLight,
            isDarkMode ? Shadows.glassDark : Shadows.glass,
            Platform.OS === 'android' && { elevation: 0 },
          ]}
        >
          <TouchableOpacity
            onPress={handleFlipBack}
            style={styles.backContent}
            activeOpacity={1}
          >
            <QRCodeView value={card.url} size={qrSize} />
            <Text
              style={[styles.backPlatformName, isDarkMode ? styles.textDark : styles.textLight]}
              numberOfLines={1}
            >
              {platformInfo.name}
            </Text>
            <Text
              style={[styles.backUsername, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}
              numberOfLines={1}
            >
              {formattedUsername}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CardDimensions.height + 40, // Extra height for QR code view
    marginBottom: CARD_GAP,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
  },
  cardLight: {
    backgroundColor: Colors.light.glass80,
    borderWidth: 1,
    borderColor: Colors.light.glassBorder,
  },
  cardDark: {
    backgroundColor: Colors.dark.glass80,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  cardBack: {},
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  customImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 12,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  username: {
    fontSize: 12,
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
  backContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  backPlatformName: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  backUsername: {
    fontSize: 10,
  },
});
