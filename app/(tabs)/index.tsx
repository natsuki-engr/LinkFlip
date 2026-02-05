import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useCards, useTheme, useProfile } from '@/context/AppContext';
import { Colors, Spacing, Shadows } from '@/constants/theme';
import { SNSCard } from '@/components/SNSCard';
import { ProfileHeader } from '@/components/ProfileHeader';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
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
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: tabBarHeight + 16 }, Shadows.elevation3]}
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
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -28,
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
});
