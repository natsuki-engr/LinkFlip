import React, { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/context/AppContext';
import { Colors, BorderRadius, Typography } from '@/constants/theme';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helper?: string;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, error, helper, style, ...props }, ref) => {
    const { isDarkMode } = useTheme();

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, isDarkMode ? styles.labelDark : styles.labelLight]}>
            {label}
          </Text>
        )}
        <RNTextInput
          ref={ref}
          style={[
            styles.input,
            isDarkMode ? styles.inputDark : styles.inputLight,
            error && styles.inputError,
            style,
          ]}
          placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
          {...props}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        {helper && !error && (
          <Text style={[styles.helper, isDarkMode ? styles.helperDark : styles.helperLight]}>
            {helper}
          </Text>
        )}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: Typography.small.fontSize,
    fontWeight: '600',
    marginBottom: 8,
  },
  labelLight: {
    color: Colors.light.text,
  },
  labelDark: {
    color: Colors.dark.text,
  },
  input: {
    borderRadius: BorderRadius.input,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: Typography.body.fontSize,
    borderWidth: 1,
  },
  inputLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: Colors.light.border,
    color: Colors.light.text,
  },
  inputDark: {
    backgroundColor: 'rgba(30, 28, 24, 0.8)',
    borderColor: Colors.dark.border,
    color: Colors.dark.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    color: Colors.error,
    fontSize: Typography.small.fontSize,
    marginTop: 4,
  },
  helper: {
    fontSize: Typography.small.fontSize,
    marginTop: 4,
  },
  helperLight: {
    color: Colors.light.textSecondary,
  },
  helperDark: {
    color: Colors.dark.textSecondary,
  },
});
