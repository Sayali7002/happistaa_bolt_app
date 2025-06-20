import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';

interface LoginScreenProps {
  navigation: any;
  route: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  
  // Get redirect path from route params if present
  const { redirectTo } = route.params || {};

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        Alert.alert('Login Failed', error.message);
      } else {
        // If there's a redirect path, navigate there, otherwise go to Dashboard
        if (redirectTo) {
          navigation.navigate(redirectTo);
        } else {
          navigation.navigate('Main');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    // Pass along the redirect path if it exists
    if (redirectTo) {
      navigation.navigate('SignUp', { redirectTo });
    } else {
      navigation.navigate('SignUp');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0F4F8', '#DEF5FA']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <Text style={styles.title}>Sign In</Text>
              
              {redirectTo && (
                <View style={styles.redirectNotice}>
                  <Text style={styles.redirectText}>
                    Sign in to continue to {redirectTo.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                </View>
              )}
              
              <View style={styles.form}>
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  required
                />
                
                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                  required
                />
                
                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  loading={loading}
                  size="large"
                  style={styles.loginButton}
                />
              </View>
              
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Don't have an account?{' '}
                  <Text style={styles.linkText} onPress={handleSignUp}>
                    Sign up
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 32,
  },
  redirectNotice: {
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  redirectText: {
    fontSize: 14,
    color: '#2B6CB0',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 16,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#4A5568',
  },
  linkText: {
    color: '#1E3A5F',
    fontWeight: '600',
  },
});