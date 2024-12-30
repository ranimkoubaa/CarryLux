import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const API_URL = 'http://192.168.100.11:3001/api/bags'; // Replace with your API URL

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

const IndexScreen = () => {
  const [bags, setBags] = useState<Bag[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Bag[]>(API_URL);
        setBags(response.data);
      } catch (error) {
        console.error('Error fetching bags:', error);
      }
    };

    fetchData(); // Directly fetch data without waiting for a loading state
  }, []);

  const handleLogin = () => {
    console.log('Navigating to login screen');
    router.push('/LoginScreen'); // Redirect to login screen
  };

  const handleRegister = () => {
    console.log('Navigating to register screen');
    router.push('/RegisterScreen'); // Redirect to register screen
  };

  // Custom render function for the header and other static content
  const renderHeader = () => (
    <View style={styles.header}>
      {/* SignIn Icon */}
      <TouchableOpacity style={styles.iconButton} onPress={handleLogin}>
        <Ionicons name="person-circle-outline" size={30} color="#fff" />
      </TouchableOpacity>
      {/* Title */}
      <Text style={styles.title}>VioraPearl</Text>
      {/* SignUp Icon */}
      <TouchableOpacity style={styles.iconButton} onPress={handleRegister}>
        <Ionicons name="person-add-outline" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={bags}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={() => (
        <>
         {/* Call to renderHeader */}
          {renderHeader()}
          {/* LottieView Above Title */}
          <LottieView
            source={require('../assets/bags-animation2.json')} // Animation path
            autoPlay
            loop
            style={{ width: '100%', height: 250 }}
          />

         

          {/* Title */}
          <Text style={styles.title}>Sacs Disponibles</Text>
        </>
      )}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <Text style={styles.price}>Prix: ${item.price.toFixed(2)}</Text>
        </View>
      )}
      // Optional: Add padding at the bottom
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff1f2' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e11d48',
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'Arial',
  },
  iconButton: {
    backgroundColor: '#f43f5e',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60, // Adjust width for icons
    height: 60, // Make the button circular
  },
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
});

export default IndexScreen;
