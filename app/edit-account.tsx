import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { useCards, useTheme } from '@/context/AppContext';
import { detectPlatformFromUrl, normalizeUrl } from '@/utils/snsDetector';
import { getPlatformInfo } from '@/constants/sns';
import { Colors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { TextInput } from '@/components/ui/TextInput';
import { SNSIcon } from '@/components/ui/SNSIcon';
import { Toast } from '@/components/ui/Toast';
import { SNSPlatform } from '@/types';

export default function EditAccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cards, updateCard } = useCards();
  const { isDarkMode } = useTheme();

  const card = cards.find((c) => c.id === id);

  const [url, setUrl] = useState(card?.url || '');
  const [detectedPlatform, setDetectedPlatform] = useState<SNSPlatform | null>(
    card?.platform || null
  );
  const [detectedUsername, setDetectedUsername] = useState<string | null>(
    card?.username || null
  );
  const [platformName, setPlatformName] = useState<string | null>(
    card ? getPlatformInfo(card.platform).name : null
  );
  const [customImage, setCustomImage] = useState<string | null>(card?.customImage || null);
  const [useCustomImage, setUseCustomImage] = useState(card?.useCustomImage || false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ visible: false, message: '', type: 'success' });

  const gradientColors = isDarkMode
    ? Colors.dark.backgroundGradient
    : Colors.light.backgroundGradient;

  // Auto-detect platform when URL changes
  useEffect(() => {
    if (url.trim()) {
      const result = detectPlatformFromUrl(url);
      if (result.success && result.platform && result.username && result.platformInfo) {
        setDetectedPlatform(result.platform);
        setDetectedUsername(result.username);
        setPlatformName(result.platformInfo.name);
        setError(null);
      } else {
        setDetectedPlatform(null);
        setDetectedUsername(null);
        setPlatformName(null);
        if (url.length > 10) {
          setError(result.error || null);
        }
      }
    } else {
      setDetectedPlatform(null);
      setDetectedUsername(null);
      setPlatformName(null);
      setError(null);
    }
  }, [url]);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      setToast({
        visible: true,
        message: '画像ライブラリへのアクセス許可が必要です',
        type: 'error',
      });
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
      setCustomImage(base64Image);
      setUseCustomImage(true);
    }
  };

  const handleRemoveImage = () => {
    setCustomImage(null);
    setUseCustomImage(false);
  };

  const handleSave = async () => {
    if (!id || !detectedPlatform || !detectedUsername) {
      setError('有効なSNS URLを入力してください');
      return;
    }

    setSaving(true);
    try {
      await updateCard(id, {
        platform: detectedPlatform,
        username: detectedUsername,
        url: normalizeUrl(url),
        customImage: customImage,
        useCustomImage: useCustomImage,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      setToast({ visible: true, message: '保存に失敗しました', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  if (!card) {
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
        <View style={[styles.centerContent, { paddingTop: insets.top }]}>
          <Text style={[styles.errorText, isDarkMode ? styles.textDark : styles.textLight]}>
            アカウントが見つかりません
          </Text>
          <GradientButton title="戻る" onPress={handleClose} />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill={isDarkMode ? Colors.dark.text : Colors.light.text}
              >
                <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </Svg>
            </TouchableOpacity>
            <Text style={[styles.pageTitle, isDarkMode ? styles.textDark : styles.textLight]}>
              アカウントを編集
            </Text>
            <View style={styles.closeButton} />
          </View>

          <GlassCard>
            <TextInput
              label="SNS URL"
              value={url}
              onChangeText={setUrl}
              placeholder="https://twitter.com/username"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              error={error || undefined}
              helper="URLを入力するとプラットフォームが自動判定されます"
            />

            {detectedPlatform && detectedUsername && (
              <View style={styles.detectionResult}>
                <View
                  style={[
                    styles.detectionCard,
                    isDarkMode ? styles.detectionCardDark : styles.detectionCardLight,
                  ]}
                >
                  <SNSIcon platform={detectedPlatform} size={32} />
                  <View style={styles.detectionInfo}>
                    <Text
                      style={[
                        styles.detectionPlatform,
                        isDarkMode ? styles.textDark : styles.textLight,
                      ]}
                    >
                      {platformName}
                    </Text>
                    <Text
                      style={[
                        styles.detectionUsername,
                        isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight,
                      ]}
                    >
                      @{detectedUsername}
                    </Text>
                  </View>
                  <View style={styles.checkmark}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill={Colors.success}>
                      <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </Svg>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.customImageSection}>
              <Text
                style={[
                  styles.customImageLabel,
                  isDarkMode ? styles.textDark : styles.textLight,
                ]}
              >
                カスタム画像（オプション）
              </Text>
              <Text
                style={[
                  styles.customImageHint,
                  isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight,
                ]}
              >
                デフォルトアイコンの代わりに使用する画像を選択できます
              </Text>

              {customImage ? (
                <View style={styles.customImagePreview}>
                  <Image source={{ uri: customImage }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill={Colors.error}>
                      <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.imagePickerButton,
                    isDarkMode ? styles.imagePickerButtonDark : styles.imagePickerButtonLight,
                  ]}
                  onPress={handlePickImage}
                >
                  <Svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
                  >
                    <Path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </Svg>
                  <Text
                    style={[
                      styles.imagePickerText,
                      isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight,
                    ]}
                  >
                    画像を選択
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <GradientButton
              title="保存"
              onPress={handleSave}
              loading={saving}
              disabled={!detectedPlatform || !detectedUsername}
            />
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>

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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.section,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: Typography.section.fontSize,
    fontWeight: '600',
  },
  errorText: {
    fontSize: Typography.body.fontSize,
    marginBottom: 16,
  },
  detectionResult: {
    marginBottom: 16,
  },
  detectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.button,
  },
  detectionCardLight: {
    backgroundColor: Colors.light.glass40,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  detectionCardDark: {
    backgroundColor: Colors.dark.glass40,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  detectionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  detectionPlatform: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
  detectionUsername: {
    fontSize: Typography.small.fontSize,
    marginTop: 2,
  },
  checkmark: {
    marginLeft: 8,
  },
  customImageSection: {
    marginBottom: 16,
  },
  customImageLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    marginBottom: 4,
  },
  customImageHint: {
    fontSize: Typography.small.fontSize,
    marginBottom: 12,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  imagePickerButtonLight: {
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.glass40,
  },
  imagePickerButtonDark: {
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.glass40,
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: Typography.body.fontSize,
  },
  customImagePreview: {
    position: 'relative',
    alignSelf: 'center',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
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
