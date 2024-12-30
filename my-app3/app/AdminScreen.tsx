import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import for clearing storage
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

const AdminScreen = () => {
  const [bags, setBags] = useState<Bag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedBag, setSelectedBag] = useState<Bag | null>(null);
  const [newBag, setNewBag] = useState<Bag>({
    _id: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    available: true,
    createdAt: '',
    updatedAt: '',
  });

  const router = useRouter();

  useEffect(() => {
    const fetchBags = async () => {
      try {
        const response = await axios.get<Bag[]>(API_URL);
        setBags(response.data);
      } catch (error) {
        console.error('Error fetching bags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBags();
  }, []);

  /*const handleLogout = () => {
    console.log('Logged out successfully');
    router.push('/LoginScreen'); // Redirect to login screen
  };*/
  

const handleLogout = async () => {
  try {
    // Clear token and role from AsyncStorage
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');

    console.log('Logged out successfully');
    router.push('/LoginScreen'); // Redirect to login screen
  } catch (error) {
    console.error('Error during logout:', error);
  }
};


  const handleEditBag = (bag: Bag) => {
    setSelectedBag(bag);
    setNewBag(bag); // Pre-fill the modal with the selected bag's details
    setIsModalVisible(true);
  };

  const handleDeleteBag = async (bagId: string) => {
    try {
      await axios.delete(`${API_URL}/${bagId}`);
      setBags(bags.filter((bag) => bag._id !== bagId));
      console.log('Bag deleted');
    } catch (error) {
      console.error('Error deleting bag:', error);
    }
  };

  const handleSaveBag = async () => {
    if (selectedBag) {
      // Update the existing bag
      try {
        await axios.put(`${API_URL}/${selectedBag._id}`, newBag);
        setBags(
          bags.map((bag) =>
            bag._id === selectedBag._id ? { ...bag, ...newBag } : bag
          )
        );
        console.log('Bag updated');
      } catch (error) {
        console.error('Error updating bag:', error);
      }
    } else {
      // Create a new bag
      try {
        const response = await axios.post(API_URL, newBag);
        setBags([...bags, response.data]);
        console.log('New bag added');
      } catch (error) {
        console.error('Error adding new bag:', error);
      }
    }
    setIsModalVisible(false); // Close modal after saving
  };

  const handleAddNewBag = () => {
    setSelectedBag(null); // Clear selectedBag to indicate it's a new bag
    setNewBag({
      _id: '',
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      available: true,
      createdAt: '',
      updatedAt: '',
    }); // Reset newBag state
    setIsModalVisible(true); // Open modal to add a new bag
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Logout Icon */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Admin - Manage Bags</Text>

      {/* Add New Bag Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddNewBag}>
        <Ionicons name="add-outline" size={30} color="#fff" />
        <Text style={styles.addButtonText}>Add New Bag</Text>
      </TouchableOpacity>

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
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEditBag(item)} style={styles.editButton}>
                <Ionicons name="pencil-outline" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteBag(item._id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={24} color="#f43f5e" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal for editing/adding bags */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
        <View style={styles.modal}>
  <Text style={styles.modalTitle}>{selectedBag ? 'Edit Bag' : 'Add New Bag'}</Text>
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    {/* Name Input */}
    <Text style={styles.label}>Bag Name</Text>
    <TextInput
      style={styles.input}
      value={newBag.name}
      onChangeText={(text) => setNewBag({ ...newBag, name: text })}
      placeholder="Enter bag name"
    />
    
    {/* Description Input */}
    <Text style={styles.label}>Description</Text>
    <TextInput
      style={styles.input}
      value={newBag.description}
      onChangeText={(text) => setNewBag({ ...newBag, description: text })}
      placeholder="Enter description"
    />
    
    {/* Price Input */}
    <Text style={styles.label}>Price</Text>
    <TextInput
      style={styles.input}
      value={newBag.price.toString()}
      onChangeText={(text) => setNewBag({ ...newBag, price: parseFloat(text) })}
      keyboardType="numeric"
      placeholder="Enter price"
    />
    
    {/* Image URL Input */}
    <Text style={styles.label}>Image URL</Text>
    <TextInput
      style={[styles.input, { maxHeight: '60%' , width:'90%'}]}
      value={newBag.imageUrl}
      onChangeText={(text) => setNewBag({ ...newBag, imageUrl: text })}
      placeholder="Enter image URL"
    />
    
    {/* Save Button */}
    <Button title="Save" onPress={handleSaveBag} color="#4CAF50" />
    {/* Cancel Button */}
    <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="#f44336" />
  </ScrollView>
</View>

        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    modal: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 15,
      width: '95%', // Increased width to make the modal wider
      maxHeight: '90%', // Ensure it doesn't exceed screen height
      alignSelf: 'center', // Center it horizontally
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    scrollContainer: {
      paddingBottom: 20,
      paddingHorizontal: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      alignSelf: 'flex-start',
    },
    input: {
      width: '100%',
      padding: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
    },
    shortInput: {
      width: '80%', // Reduce width for shorter inputs
      alignSelf: 'center', // Center it in the modal
    },







  container: { flex: 1, padding: 20, backgroundColor: '#fefefe' },
  header: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#e11d48', textAlign: 'center', marginBottom: 20 },
  logoutButton: { backgroundColor: '#f43f5e', padding: 10, borderRadius: 50 },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50,
    marginVertical: 15,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 18, marginTop: 5 },
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
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  editButton: { padding: 10, backgroundColor: '#f43f5e', borderRadius: 5 },
  deleteButton: { padding: 10, backgroundColor: '#f43f5e', borderRadius: 5 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
 
});

export default AdminScreen;
