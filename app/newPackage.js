// app/newPackage.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, I18nManager } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { auth, db } from '../config/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function NewPackage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const [formData, setFormData] = useState({
    pickupLocation: 'שופרסל דיל',
    deliveryAddress: '',
    recipientName: '',
    recipientPhone: '',
    packageSize: '',
    priority: 'normal',
    specialInstructions: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) router.replace('/LoginScreen');
    });
    return unsubscribe;
  }, [router]);

  useEffect(() => {
    let price = 25;
    if (formData.packageSize === 'small') price = 20;
    else if (formData.packageSize === 'medium') price = 30;
    else if (formData.packageSize === 'large') price = 45;
    if (formData.priority === 'urgent') price += 15;
    setEstimatedPrice(price);
  }, [formData.packageSize, formData.priority]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.deliveryAddress || !formData.recipientName || !formData.packageSize) {
      Alert.alert('שגיאה', 'אנא מלא את כל שדות החובה');
      return;
    }
    if (formData.recipientPhone && !/^0\d{1,2}-?\d{6,7}$/.test(formData.recipientPhone)) {
      Alert.alert('שגיאה', 'מספר הטלפון אינו תקין');
      return;
    }
    if (!user) {
      Alert.alert('שגיאה', 'המשתמש אינו מחובר');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'packages'), {
        ...formData,
        estimatedPrice,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      Alert.alert('הצלחה', 'המשלוח נוצר בהצלחה!');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      Alert.alert('שגיאה', 'משהו השתבש ביצירת המשלוח');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>בקשת משלוח חדשה</Text>

      <Text style={styles.label}>כתובת למשלוח *</Text>
      <TextInput
        style={styles.input}
        placeholder="רחוב והעיר"
        value={formData.deliveryAddress}
        onChangeText={(text) => handleChange('deliveryAddress', text)}
      />

      <Text style={styles.label}>שם המקבל *</Text>
      <TextInput
        style={styles.input}
        placeholder="ישראל ישראלי"
        value={formData.recipientName}
        onChangeText={(text) => handleChange('recipientName', text)}
      />

      <Text style={styles.label}>טלפון המקבל</Text>
      <TextInput
        style={styles.input}
        placeholder="050-1234567"
        keyboardType="phone-pad"
        value={formData.recipientPhone}
        onChangeText={(text) => handleChange('recipientPhone', text)}
      />

      <Text style={styles.label}>גודל החבילה *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.packageSize}
          onValueChange={(value) => handleChange('packageSize', value)}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="בחר גודל" value="" />
          <Picker.Item label="קטן (שקית אחת)" value="small" />
          <Picker.Item label="בינוני (עד 3 שקיות)" value="medium" />
          <Picker.Item label="גדול (ארגז או יותר)" value="large" />
        </Picker>
      </View>

      <Text style={styles.label}>עדיפות</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.priority}
          onValueChange={(value) => handleChange('priority', value)}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="רגיל (עד שעתיים)" value="normal" />
          <Picker.Item label="דחוף (עד שעה, בתוספת תשלום)" value="urgent" />
        </Picker>
      </View>

      <Text style={styles.label}>הוראות מיוחדות</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        placeholder="לדוגמה: להשאיר אצל השומר"
        value={formData.specialInstructions}
        onChangeText={(text) => handleChange('specialInstructions', text)}
      />

      <Text style={styles.summary}>מחיר משוער: ₪{estimatedPrice}</Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>שלח בקשה למשלוח</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: '500',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 4,
  },
  picker: {
    height: 50,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  summary: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007aff',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
});
