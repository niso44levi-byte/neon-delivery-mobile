// app/HomeScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  I18nManager,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  // הפעלת RTL פעם אחת
  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ברוך הבא 👋</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/dashboard')}
      >
        <Text style={styles.buttonText}>ללוח הבקרה</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={() => Alert.alert('עובד!', 'Alert פועל תקין')}
      >
        <Text style={styles.buttonText}>בדיקת התראה</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 12,
  },
  secondary: { backgroundColor: '#34c759' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
