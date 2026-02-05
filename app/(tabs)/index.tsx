import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { useCards, useTheme, useProfile } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, Shadows, CardDimensions } from '@/constants/theme';
import { SNSCard } from '@/components/SNSCard';
import { ProfileHeader } from '@/components/ProfileHeader';

const SCREEN_PADDING = 16;
const CARD_GAP = 16;
const screenWidth = Dimensions.get('window').width;
const addCardWidth = (screenWidth - SCREEN_PADDING * 2 - CARD_GAP) / 2;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { cards } = useCards();
  const { isLoading } = useProfile();

  const [refreshing, setRefreshing] = useState(false);

  const gradientColors = isDarkMode
    ? Colors.dark.backgroundGradient
    : Colors.light.backgroundGradient;

  const sortedCards = [...cards].sort((a, b) => a.order - b.order);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const handleAddAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/add-account');
  };

  if (isLoading) {
    return (
      <LinearGradient colors={gradientColors} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.orange} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary.orange}
          />
        }
      >
        <ProfileHeader />

        <View style={styles.cardsContainer}>
          <View style={styles.cardsGrid}>
            {sortedCards.map((card) => (
              <SNSCard
                key={card.id}
                card={card}
              />
            ))}
            <TouchableOpacity
              style={[
                styles.addCard,
                { width: addCardWidth },
                isDarkMode ? styles.addCardDark : styles.addCardLight,
                isDarkMode ? Shadows.glassDark : Shadows.glass,
              ]}
              onPress={handleAddAccount}
              activeOpacity={0.7}
            >
              <View style={[styles.addIconCircle, isDarkMode ? styles.addIconCircleDark : styles.addIconCircleLight]}>
                <Svg width={28} height={28} viewBox="0 0 24 24" fill={Colors.primary.orange}>
                  <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </Svg>
              </View>
              <Text style={[styles.addCardText, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                アカウントを追加
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  cardsContainer: {
    paddingHorizontal: Spacing.screen,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  addCard: {
    height: CardDimensions.height + 40,
    borderRadius: BorderRadius.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: CARD_GAP,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addCardLight: {
    backgroundColor: Colors.light.glass60,
    borderColor: Colors.light.border,
  },
  addCardDark: {
    backgroundColor: Colors.dark.glass60,
    borderColor: Colors.dark.border,
  },
  addIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  addIconCircleLight: {
    backgroundColor: Colors.primary.orange + '15',
  },
  addIconCircleDark: {
    backgroundColor: Colors.primary.orange + '20',
  },
  addCardText: {
    fontSize: 13,
    fontWeight: '500',
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
