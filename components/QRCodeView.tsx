import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import QRCode from 'qrcode';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from '@/context/AppContext';
import { Colors } from '@/constants/theme';

interface QRCodeViewProps {
  value: string;
  size?: number;
}

export function QRCodeView({ value, size = 120 }: QRCodeViewProps) {
  const { isDarkMode } = useTheme();
  const [svgPath, setSvgPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function generateQR() {
      try {
        setLoading(true);
        // Generate QR code as SVG path
        const qrData = await QRCode.create(value, {
          errorCorrectionLevel: 'M',
        });

        if (!mounted) return;

        const modules = qrData.modules;
        const moduleCount = modules.size;
        const cellSize = size / moduleCount;

        let path = '';
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (modules.get(row, col)) {
              const x = col * cellSize;
              const y = row * cellSize;
              path += `M${x},${y}h${cellSize}v${cellSize}h-${cellSize}Z`;
            }
          }
        }

        setSvgPath(path);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    generateQR();

    return () => {
      mounted = false;
    };
  }, [value, size]);

  if (loading) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <ActivityIndicator color={isDarkMode ? Colors.dark.text : Colors.light.text} />
      </View>
    );
  }

  if (!svgPath) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View style={styles.errorPlaceholder} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Rect x="0" y="0" width={size} height={size} fill="white" />
        <Path d={svgPath} fill={isDarkMode ? Colors.dark.background : '#000'} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  errorPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
});
