// app/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Animated,
  I18nManager,
  Alert,
} from 'react-native';
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, expoClientId, androidClientId, iosClientId } from '../config/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const screenWidth = Dimensions.get('window').width;

export default function LoginScreen() {
  const router = useRouter();
  const isRTL = I18nManager.isRTL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];

  // Google auth request (request משמש לבדיקה אם מוכן)
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId,
    androidClientId,
    iosClientId,
  });

  // אנימציית כניסה של הלוגו
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // טיפול בתשובת Google → Firebase
  useEffect(() => {
    const signInWithGoogleFirebase = async () => {
      if (response?.type !== 'success') return;

      const { id_token } = response.params;
      if (!id_token) {
        Alert.alert(isRTL ? 'שגיאה' : 'Error', isRTL ? 'לא התקבל אסימון מזהה מ־Google' : 'No ID token received from Google');
        return;
      }

      try {
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
        router.replace('/home');
      } catch (err) {
        Alert.alert(isRTL ? 'שגיאה' : 'Error', err?.message ?? (isRTL ? 'אירעה שגיאה בהתחברות' : 'Login failed'));
      }
    };

    signInWithGoogleFirebase();
  }, [response, router, isRTL]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(isRTL ? 'שגיאה' : 'Error', isRTL ? 'נא למלא אימייל וסיסמה' : 'Please fill email and password');
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/home');
    } catch (err) {
      Alert.alert(isRTL ? 'שגיאה' : 'Error', err?.message ?? (isRTL ? 'אירעה שגיאה בהתחברות' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Animated.Image
          source={require('../assets/images/logo.png')}
          style={[styles.logo, { opacity: fadeAnim }]}
          resizeMode="contain"
        />

        <Text style={styles.title}>{isRTL ? 'ברוך הבא' : 'Welcome'}</Text>

        <TextInput
          style={styles.input}
          placeholder={isRTL ? 'אימייל' : 'Email'}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          textAlign={isRTL ? 'right' : 'left'}
        />

        <TextInput
          style={styles.input}
          placeholder={isRTL ? 'סיסמה' : 'Password'}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          textAlign={isRTL ? 'right' : 'left'}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>{isRTL ? 'כניסה' : 'Login'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.googleButton, !request && { opacity: 0.6 }]}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Text style={styles.googleText}>
            {isRTL ? 'התחברות עם Google' : 'Sign in with Google'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.switchText}>
            {isRTL ? 'אין חשבון? צור חשבון' : 'Don’t have an account? Sign up'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  logo: {
    width: screenWidth * 0.65,
    height: screenWidth * 0.65,
    marginBottom: 35,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffffcc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#00C4B4',
    borderRadius: 10,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  googleText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  switchText: {
    color: '#eeeeee',
    fontSize: 14,
    marginTop: 5,
    textDecorationLine: 'underline',
  },
});
