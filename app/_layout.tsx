// app/_layout.tsx
import React, { useEffect } from 'react';
import { I18nManager, Platform, BackHandler, Alert } from 'react-native';
import { Stack, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const segments = useSegments();

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      // true אם אין סגמנטים (root)
      const isRoot = !segments?.length;

      if (isRoot) {
        Alert.alert('יציאה מהאפליקציה', 'לסגור עכשיו?', [
          { text: 'ביטול', style: 'cancel' },
          { text: 'צא', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [segments]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </SafeAreaProvider>
  );
}
