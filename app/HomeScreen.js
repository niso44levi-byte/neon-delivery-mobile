// app/HomeScreen.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const isRTL = I18nManager.isRTL;
  const router = useRouter();
  const userName = auth.currentUser?.displayName || (isRTL ? 'משתמש' : 'User');

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/login');
    } catch (error) {
      Alert.alert(isRTL ? 'שגיאה' : 'Error', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#00c6ff', '#0072ff']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>
        {isRTL ? `שלום ${userName} 👋` : `Hello ${userName} 👋`}
      </Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{isRTL ? 'התנתק' : 'Logout'}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
  },
  logoutButton: {
    backgroundColor: '#ffffffcc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  logoutText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
