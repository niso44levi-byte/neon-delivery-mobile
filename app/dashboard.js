// app/dashboard.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../config/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ pending: 0, in_transit: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.replace('/LoginScreen');
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "packages"), where("userEmail", "==", user.email));
    const unsubscribePackages = onSnapshot(q, (querySnapshot) => {
      let pending = 0, in_transit = 0, delivered = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'pending') pending++;
        if (data.status === 'in_transit') in_transit++;
        if (data.status === 'delivered') delivered++;
      });
      setStats({ pending, in_transit, delivered });
    });

    return () => unsubscribePackages();
  }, [user]);

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text>טוען נתונים...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ברוך שובך, {user.displayName || 'לקוח'}!</Text>
      <Text style={styles.subtitle}>הנה סיכום הפעילות שלך במערכת.</Text>

      <View style={styles.cardContainer}>
        <Card title="בהמתנה" count={stats.pending} icon="clock-outline" />
        <Card title="בדרך" count={stats.in_transit} icon="truck-delivery-outline" />
        <Card title="נמסרו" count={stats.delivered} icon="check-decagram" />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/newPackage')}>
        <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>צור משלוח חדש</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Card({ title, count, icon }) {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name={icon} size={24} color="#007aff" />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 100,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007aff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
