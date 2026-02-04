import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { useCards, useTheme, useProfile } from '@/context/AppContext';
import { SNSCard as SNSCardType } from '@/types';
import { Colors, Spacing } from '@/constants/theme';
import { SNSCard } from '@/components/SNSCard';
import { ProfileHeader } from '@/components/ProfileHeader';
import { Toast } from '@/components/ui/Toast';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { cards } = useCards();
  const { isLoading } = useProfile();

  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

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

  const handleCopy = (url: string) => {
    setToast({ visible: true, message: 'URLをコピーしました' });
  };

  const handleShare = async (card: SNSCardType) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // For now, just show a toast since we need more complex sharing logic
        setToast({ visible: true, message: 'シェア機能は準備中です' });
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const hideToast = () => {
    setToast({ visible: false, message: '' });
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

        {sortedCards.length > 0 ? (
          <View style={styles.cardsContainer}>
            <View style={styles.cardsGrid}>
              {sortedCards.map((card) => (
                <SNSCard
                  key={card.id}
                  card={card}
                  onCopy={handleCopy}
                  onShare={handleShare}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, isDarkMode ? styles.textDark : styles.textLight]}>
              SNSアカウントがありません
            </Text>
            <Text
              style={[
                styles.emptyDescription,
                isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight,
              ]}
            >
              設定画面からSNSアカウントを追加して、{'\n'}
              QRコードを生成しましょう
            </Text>
          </View>
        )}
      </ScrollView>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onHide={hideToast}
        type="success"
      />
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
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
