import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and if token exists in AsyncStorage
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/UserScreen'); // If already logged in, redirect to UserScreen
      }
    };
    checkAuth();
  }, [router]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.100.11:3001/api/users/login', {
        email,
        password,
      });

      // Log the full response to check if token and role are returned
      console.log('Login response:', response.data);

      const { token, role } = response.data;

      if (!token || !role) {
        setError('No token or role returned');
        return;
      }

      // Store the token and role in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', role);

      // Navigate based on the role
      if (role === 'admin') {
        router.push('/AdminScreen');
      } else if (role === 'user') {
        router.push('/UserScreen');
      } else {
        setError('Role not recognized');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    }
  };

  const handleBackPress = () => {
    router.replace('/'); // Redirect back to the Index screen
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={30} color="#f43f5e" />
      </TouchableOpacity>

      <Text style={styles.title}>Login</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Add Register Link */}
      <TouchableOpacity onPress={() => router.push('/RegisterScreen')}>
        <Text style={styles.registerLink}>Don't have an account? Sign Up</Text>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f43f5e',
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
    backgroundColor: '#f43f5e',
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
  registerLink: {
    color: '#f43f5e',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;
