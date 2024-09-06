import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import DatePicker from './DatePicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

// Placeholder image URL
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150';

const fetchImageFromS3 = async (organisationName, parentPropertyName, childPropertyName) => {
  try {
    // Construct the URL based on the provided format
    const imageUrl = `https://ignitens.s3.eu-north-1.amazonaws.com/${organisationName}/${parentPropertyName}/${childPropertyName}/images/thumbnail/thumbnail.jpg`;
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image from S3:', error);
    return PLACEHOLDER_IMAGE; // Use placeholder if there is an error
  }
};

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          setError('No username found in storage');
        }
      } catch (err) {
        console.error('Error fetching username from AsyncStorage:', err);
        setError('Failed to fetch username from storage');
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const storedWatchlist = await AsyncStorage.getItem('watchlist');
        if (storedWatchlist) {
          const watchlistItems = JSON.parse(storedWatchlist);
          const watchlistWithImages = await Promise.all(
            watchlistItems.map(async (item) => {
              const imageUrl = await fetchImageFromS3(item.organisationName, item.parentPropertyName, item.propertyName);
              return { ...item, imageURL: imageUrl };
            })
          );
          setWatchlist(watchlistWithImages);
        } else {
          setError('No watchlist found in storage');
        }
      } catch (err) {
        console.error('Error fetching watchlist from AsyncStorage:', err);
        setError('Failed to fetch watchlist from storage');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleEdit = (item) => {
    setCurrentItem(item);
    setNewDate(new Date(item.date));
    setNewTime(item.time);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    if (currentItem && newDate) {
      try {
        const updatedItem = { ...currentItem, date: newDate.toISOString().split('T')[0], time: newTime };
        const updatedWatchlist = watchlist.map((item) =>
          item.id === currentItem.id ? updatedItem : item
        );
        await AsyncStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        setWatchlist(updatedWatchlist);
        setIsModalVisible(false);
      } catch (err) {
        console.error('Error updating watchlist:', err);
        Alert.alert('Error', 'Failed to update watchlist');
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete ${item.propertyName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              // Filter out the item to delete
              const updatedWatchlist = watchlist.filter((w) => w.propertyName !== item.propertyName);
              
              // Update the watchlist in AsyncStorage
              await AsyncStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
              
              // Update the state with the filtered list
              setWatchlist(updatedWatchlist);
            } catch (err) {
              console.error('Error deleting item from watchlist:', err);
              Alert.alert('Error', 'Failed to delete item from watchlist');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  

  const handleBookNow = async () => {
    try {
      const response = await axios.post('https://theserver-tp6r.onrender.com/slots/bookings', {
        username,
        watchlist,
      });
      Alert.alert('Success', 'Booking successful!');
    } catch (error) {
      console.error('Error booking:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to book');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.usernameText}>Username: {username}</Text>
      {watchlist.map((item) => (
        <View key={item.id || Math.random()} style={styles.card}>
          <Image source={{ uri: item.imageURL }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.propertyName}>{item.propertyName}</Text>
            <Text style={styles.dateTime}>{item.date} - {item.time}</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={handleBookNow} style={styles.bookNowButton}>
        <Text style={styles.bookNowText}>Book Now</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <DatePicker date={newDate} onDateChange={setNewDate} />
          <Picker selectedValue={newTime} onValueChange={(itemValue) => setNewTime(itemValue)}>
            <Picker.Item label="10:00 AM" value="10:00 AM" />
            <Picker.Item label="11:00 AM" value="11:00 AM" />
            <Picker.Item label="12:00 PM" value="12:00 PM" />
            {/* Add more time slots as needed */}
          </Picker>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32, 
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 8,
  },
  editText: {
    color: 'blue',
  },
  deleteText: {
    color: 'red',
  },
  bookNowButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  bookNowText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  saveText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default ProfilePage;
