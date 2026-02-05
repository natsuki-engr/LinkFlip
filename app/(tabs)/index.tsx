import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCards, useTheme, useProfile } from '@/context/AppContext';
import { Colors, Spacing } from '@/constants/theme';
import { SNSCard } from '@/components/SNSCard';
import { ProfileHeader } from '@/components/ProfileHeader';
import { setCurrentUrl } from '@/services/nfcEmitter';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { cards } = useCards();
  const { isLoading } = useProfile();

  const [refreshing, setRefreshing] = useState(false);

  const handleCardFlip = useCallback((url: string | null) => {
    setCurrentUrl(url);
  }, []);

  const gradientColors = isDarkMode
    ? Colors.dark.backgroundGradient
    : Colors.light.backgroundGradient;

  const sortedCards = [...cards].sort((a, b) => a.order - b.order);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

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
                onFlip={handleCardFlip}
              />
            ))}
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
});
