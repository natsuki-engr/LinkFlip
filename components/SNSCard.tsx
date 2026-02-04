import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
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
import { IconButton } from './ui/IconButton';
import Svg, { Path } from 'react-native-svg';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface SNSCardProps {
  card: SNSCardType;
  onCopy?: (url: string) => void;
  onShare?: (card: SNSCardType) => void;
}

// Calculate card width based on screen width (2 columns with padding and gap)
const SCREEN_PADDING = 16;
const CARD_GAP = 16;
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - SCREEN_PADDING * 2 - CARD_GAP) / 2;

export function SNSCard({ card, onCopy, onShare }: SNSCardProps) {
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
    scale.value = withSpring(Animations.press.scale, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handleCopy = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Clipboard.setStringAsync(card.url);
    onCopy?.(card.url);
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onShare?.(card);
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
      <AnimatedTouchable
        onPress={handleFlip}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          frontAnimatedStyle,
          isDarkMode ? styles.cardDark : styles.cardLight,
          isDarkMode ? Shadows.glassDark : Shadows.glass,
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

      {/* Back Face (QR Code) */}
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          backAnimatedStyle,
          isDarkMode ? styles.cardDark : styles.cardLight,
          isDarkMode ? Shadows.glassDark : Shadows.glass,
        ]}
      >
        <TouchableOpacity
          onPress={handleFlipBack}
          style={styles.backContent}
          activeOpacity={1}
        >
          <QRCodeView value={card.url} size={cardWidth - 48} />
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
          <View style={styles.actionButtons}>
            <IconButton onPress={handleCopy} variant="glass" size={36}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill={isDarkMode ? Colors.dark.text : Colors.light.text}>
                <Path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </Svg>
            </IconButton>
            <IconButton onPress={handleShare} variant="glass" size={36}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill={isDarkMode ? Colors.dark.text : Colors.light.text}>
                <Path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
              </Svg>
            </IconButton>
          </View>
        </TouchableOpacity>
      </Animated.View>
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
  cardBack: {
    zIndex: -1,
  },
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
    padding: 12,
  },
  backPlatformName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  backUsername: {
    fontSize: 11,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});
