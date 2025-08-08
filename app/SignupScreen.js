import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  I18nManager,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isRTL = I18nManager.isRTL;

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      return Alert.alert('שגיאה', 'אנא מלא את כל השדות.');
    }
    if (password !== confirmPassword) {
      return Alert.alert('שגיאה', 'הסיסמאות אינן תואמות.');
    }
    if (password.length < 6) {
      return Alert.alert('שגיאה', 'הסיסמה חייבת להכיל לפחות 6 תווים.');
    }

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('נרשמת בהצלחה!');
      router.replace('/home');
    } catch (error) {
      console.log("Signup error:", error.message);
      Alert.alert('שגיאה', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <LinearGradient
        colors={["#3a7bd5", "#00d2ff"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image
          source={require('../assets/logo.png')}  // ✅ נתיב מתוקן
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{isRTL ? 'הרשמה' : 'Sign up'}</Text>

        <TextInput
          style={styles.input}
          placeholder={isRTL ? "אימייל" : "Email"}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          textAlign={isRTL ? 'right' : 'left'}
        />
        <TextInput
          style={styles.input}
          placeholder={isRTL ? "סיסמה" : "Password"}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          textAlign={isRTL ? 'right' : 'left'}
        />
        <TextInput
          style={styles.input}
          placeholder={isRTL ? "אימות סיסמה" : "Confirm Password"}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          textAlign={isRTL ? 'right' : 'left'}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>{isRTL ? 'הרשמה' : 'Sign up'}</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          {isRTL ? 'כבר יש לך חשבון?' : 'Already have an account?'}{' '}
          <Text style={styles.loginLink} onPress={() => router.push('/login')}>
            {isRTL ? 'התחבר' : 'Login'}
          </Text>
        </Text>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    width: width,
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    backgroundColor: '#ffffffdd',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000000aa',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 14,
  },
  loginLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
