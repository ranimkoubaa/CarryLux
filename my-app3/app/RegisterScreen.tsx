import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios, { AxiosError } from 'axios'; // Import AxiosError type
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message'; // Import Toast for success message
import { Alert } from 'react-native';
const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // loading state
  const router = useRouter();

  

const handleRegister = async () => {
  if (!email || !password) {
    setError('Both email and password are required');
    return;
  }

  setError('');
  setLoading(true); // Set loading to true when the request starts

  try {
    const response = await axios.post('http://192.168.100.11:3001/api/users/register', { email, password });

    if (response.status === 201) {
      // Show success alert
      Alert.alert('Registration Successful', 'You are now registered. Please log in.', [
        { text: 'OK', onPress: () => router.push('/LoginScreen') },
      ]);

      setLoading(false); // Stop loading after successful registration
    } else {
      setLoading(false); // Ensure loading is set to false in case of an unexpected response
      setError('Failed to register. Please try again.');
    }
  } catch (err: unknown) {
    setLoading(false); // Stop loading
    const error = err as AxiosError;
    console.error('Error during registration:', error.response ? error.response.data : error.message);
    setError('Failed to register. Please try again.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
        placeholderTextColor="#aaa"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Display loading spinner when loading */}
      {loading ? (
        <ActivityIndicator size="large" color="#f43f5e" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}

      {/* Display success message */}
      {loading && <Text style={styles.loadingText}>Registering...</Text>}

      {/* Add Login Link */}
      <TouchableOpacity onPress={() => router.push('/LoginScreen')}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f43f5e', // Matching LoginScreen title color
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f43f5e', // Matching LoginScreen button color
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#f43f5e',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 12,
    color: '#f43f5e', // Matching LoginScreen color
    textAlign: 'center',
  },
});

export default RegisterScreen;
