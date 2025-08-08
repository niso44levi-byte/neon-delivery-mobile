import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../config/firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export default function HistoryScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.replace('/LoginScreen');
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'packages'),
      where('userEmail', '==', user.email),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPackages(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.text}>טוען היסטוריית משלוחים...</Text>
      </View>
    );
  }

  if (packages.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>לא נמצאו משלוחים קודמים.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>היסטוריית משלוחים</Text>
      {packages.map((pkg) => (
        <View key={pkg.id} style={[styles.card, statusStyle(pkg.status)]}>
          <Text style={styles.label}>לכתובת:</Text>
          <Text style={styles.value}>{pkg.deliveryAddress}</Text>

          <Text style={styles.label}>סטטוס:</Text>
          <Text style={styles.value}>{translateStatus(pkg.status)}</Text>

          <Text style={styles.label}>תאריך:</Text>
          <Text style={styles.value}>
            {pkg.createdAt?.toDate().toLocaleString('he-IL')}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function translateStatus(status) {
  switch (status) {
    case 'pending': return 'ממתין לשליח';
    case 'in_transit': return 'בדרך';
    case 'delivered': return 'נמסר';
    default: return 'לא ידוע';
  }
}

function statusStyle(status) {
  switch (status) {
    case 'pending': return { borderLeftColor: '#f5a623' };
    case 'in_transit': return { borderLeftColor: '#007aff' };
    case 'delivered': return { borderLeftColor: '#28a745' };
    default: return { borderLeftColor: '#ccc' };
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    gap: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 6,
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    marginTop: 6,
  },
  value: {
    fontSize: 15,
    marginBottom: 4,
  },
});
