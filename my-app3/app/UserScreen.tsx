import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://192.168.100.11:3001/api/bags'; 

interface Bag {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserScreen = () => {
  const [bags, setBags] = useState<Bag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [likedBags, setLikedBags] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Bag[]>(API_URL);
        setBags(response.data);
      } catch (error) {
        console.error('Error fetching bags:', error);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(fetchData, 2000); 
  }, []);

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage (log out)
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');

      router.push('/LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLike = (bagId: string) => {
    setLikedBags((prevLikedBags) => {
      const newLikedBags = new Set(prevLikedBags);
      if (newLikedBags.has(bagId)) {
        newLikedBags.delete(bagId);
      } else {
        newLikedBags.add(bagId);
      }
      return newLikedBags;
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../assets/loading-animation2.json')}
          autoPlay
          loop
          style={{ width: 600, height: 450 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with logout icon */}
      <View style={styles.header}>
        {/* Logout Icon */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Sacs Disponibles</Text>

      {/* FlatList to render bags */}
      <FlatList
        data={bags}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.price}>Prix: ${item.price.toFixed(2)}</Text>
            <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(item._id)}>
              <Ionicons
                name={likedBags.has(item._id) ? 'heart' : 'heart-outline'}
                size={24}
                color={likedBags.has(item._id) ? '#f43f5e' : '#333'}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff1f2' },
  header: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e11d48',
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'Arial',
  },
  logoutButton: { backgroundColor: '#f43f5e', padding: 10, borderRadius: 50 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#f43f5e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#e11d48' },
  description: { fontSize: 16, color: '#333', marginBottom: 10 },
  image: { width: '100%', height: 250, borderRadius: 10, marginBottom: 10 },
  price: { fontSize: 18, color: '#f43f5e' },
  likeButton: { marginTop: 10, alignSelf: 'flex-end' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    alignSelf: 'center',
  },
});

export default UserScreen;

