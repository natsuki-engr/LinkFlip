import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { useProfile, useCards, useTheme } from '@/context/AppContext';
import { Colors, BorderRadius, Spacing, Shadows, Typography } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { TextInput } from '@/components/ui/TextInput';
import { SNSIcon } from '@/components/ui/SNSIcon';
import { Toast } from '@/components/ui/Toast';
import { getPlatformInfo } from '@/constants/sns';
import { formatUsername } from '@/utils/snsDetector';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const { cards, deleteCard } = useCards();
  const { isDarkMode, settings, setColorScheme } = useTheme();

  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ visible: false, message: '', type: 'success' });

  const gradientColors = isDarkMode
    ? Colors.dark.backgroundGradient
    : Colors.light.backgroundGradient;

  const sortedCards = [...cards].sort((a, b) => a.order - b.order);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('権限が必要です', '画像を選択するには、写真ライブラリへのアクセス許可が必要です。');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      await updateProfile({ profileImage: base64Image });
      setToast({ visible: true, message: 'プロフィール画像を更新しました', type: 'success' });
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setToast({ visible: true, message: '名前を入力してください', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setToast({ visible: true, message: 'プロフィールを保存しました', type: 'success' });
    } catch (error) {
      setToast({ visible: true, message: '保存に失敗しました', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAccount = () => {
    router.push('/add-account');
  };

  const handleEditAccount = (cardId: string) => {
    router.push({ pathname: '/edit-account', params: { id: cardId } });
  };

  const handleDeleteAccount = (cardId: string, platformName: string) => {
    Alert.alert(
      'アカウントを削除',
      `${platformName}のアカウントを削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await deleteCard(cardId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setToast({ visible: true, message: 'アカウントを削除しました', type: 'success' });
          },
        },
      ]
    );
  };

  const handleDarkModeToggle = async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setColorScheme(value ? 'dark' : 'light');
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.pageTitle, isDarkMode ? styles.textDark : styles.textLight]}>
          設定
        </Text>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.textDark : styles.textLight]}>
            プロフィール編集
          </Text>
          <GlassCard>
            <TouchableOpacity style={styles.avatarSection} onPress={handlePickImage}>
              {profile.profileImage ? (
                <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    isDarkMode ? styles.avatarPlaceholderDark : styles.avatarPlaceholderLight,
                  ]}
                >
                  <Svg
                    width={32}
                    height={32}
                    viewBox="0 0 24 24"
                    fill={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
                  >
                    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </Svg>
                </View>
              )}
              <Text
                style={[
                  styles.avatarHint,
                  isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight,
                ]}
              >
                タップして画像を変更
              </Text>
            </TouchableOpacity>

            <TextInput
              label="名前"
              value={name}
              onChangeText={setName}
              placeholder="あなたの名前"
              maxLength={50}
            />

            <TextInput
              label="バイオ"
              value={bio}
              onChangeText={setBio}
              placeholder="自己紹介を入力"
              maxLength={150}
              multiline
              numberOfLines={3}
              style={styles.bioInput}
            />

            <GradientButton
              title="プロフィールを保存"
              onPress={handleSaveProfile}
              loading={saving}
            />
          </GlassCard>
        </View>

        {/* SNS Accounts Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.textDark : styles.textLight]}>
            SNSアカウント管理
          </Text>

          <GradientButton
            title="SNSアカウントを追加"
            onPress={handleAddAccount}
            variant="secondary"
            icon={
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="#fff">
                <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </Svg>
            }
            style={styles.addButton}
          />

          {sortedCards.length > 0 ? (
            <GlassCard noPadding>
              {sortedCards.map((card, index) => {
                const platformInfo = getPlatformInfo(card.platform);
                return (
                  <View
                    key={card.id}
                    style={[
                      styles.accountItem,
                      index < sortedCards.length - 1 && styles.accountItemBorder,
                      isDarkMode && styles.accountItemBorderDark,
                    ]}
                  >
                    <View style={styles.accountInfo}>
                      <SNSIcon platform={card.platform} size={24} />
                      <View style={styles.accountText}>
                        <Text
                          style={[styles.accountPlatform, isDarkMode ? styles.textDark : styles.textLight]}
                        >
                          {platformInfo.name}
                        </Text>
                        <Text
                          style={[
                            styles.accountUsername,
                            isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight,
                          ]}
                        >
                          {formatUsername(card.platform, card.username)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.accountActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditAccount(card.id)}
                      >
                        <Svg
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
                        >
                          <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </Svg>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteAccount(card.id, platformInfo.name)}
                      >
                        <Svg width={20} height={20} viewBox="0 0 24 24" fill={Colors.error}>
                          <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </Svg>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </GlassCard>
          ) : (
            <GlassCard>
              <Text
                style={[
                  styles.emptyText,
                  isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight,
                ]}
              >
                SNSアカウントがまだありません
              </Text>
            </GlassCard>
          )}
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.textDark : styles.textLight]}>
            アプリ設定
          </Text>
          <GlassCard noPadding>
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, isDarkMode ? styles.textDark : styles.textLight]}>
                ダークモード
              </Text>
              <Switch
                value={settings.colorScheme === 'dark'}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: '#767577', true: Colors.primary.orange }}
                thumbColor="#fff"
              />
            </View>
          </GlassCard>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.textDark : styles.textLight]}>
            このアプリについて
          </Text>
          <GlassCard>
            <Text style={[styles.aboutText, isDarkMode ? styles.textDark : styles.textLight]}>
              LinkFlip v1.0.0
            </Text>
            <Text
              style={[
                styles.aboutDescription,
                isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight,
              ]}
            >
              SNSプロフィールをQRコードで簡単に共有できるアプリです。
            </Text>
          </GlassCard>
        </View>
      </ScrollView>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onHide={hideToast}
        type={toast.type}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
  },
  pageTitle: {
    fontSize: Typography.title.fontSize,
    fontWeight: '700',
    marginBottom: Spacing.section,
  },
  section: {
    marginBottom: Spacing.section,
  },
  sectionTitle: {
    fontSize: Typography.section.fontSize,
    fontWeight: '600',
    marginBottom: Spacing.element,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarPlaceholderLight: {
    backgroundColor: Colors.light.glass60,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  avatarPlaceholderDark: {
    backgroundColor: Colors.dark.glass60,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  avatarHint: {
    fontSize: Typography.small.fontSize,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    marginBottom: Spacing.element,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  accountItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  accountItemBorderDark: {
    borderBottomColor: Colors.dark.border,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountText: {
    marginLeft: 12,
    flex: 1,
  },
  accountPlatform: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
  accountUsername: {
    fontSize: Typography.small.fontSize,
    marginTop: 2,
  },
  accountActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: '500',
  },
  aboutText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    marginBottom: 4,
  },
  aboutDescription: {
    fontSize: Typography.small.fontSize,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: Typography.body.fontSize,
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
