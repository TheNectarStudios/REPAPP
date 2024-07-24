import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Modal from 'react-native-modal';
import DatePicker from './DatePicker';
import { Picker } from '@react-native-picker/picker';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          setError('No username found in storage');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching username from AsyncStorage:', err);
        setError('Failed to fetch username from storage');
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    if (username) {
      const fetchBookings = async () => {
        try {
          const response = await axios.get(`http://192.168.0.102:3000/slots/bookings/${username}`);
          console.log('API response:', response.data);
          if (response.data) {
            setBookings(response.data);
          } else {
            setError('No bookings found in response');
          }
        } catch (err) {
          console.error('Error fetching bookings:', err);
          setError('Failed to fetch bookings');
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [username]);

  const handleEdit = (booking) => {
    setCurrentBooking(booking);
    setNewDate(new Date(booking.date));
    setNewTime(booking.time);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    if (currentBooking) {
      try {
        const response = await axios.put(`http://192.168.0.102:3000/slots/booking/${currentBooking._id}`, {
          ...currentBooking,
          date: newDate.toISOString().split('T')[0],
          time: newTime,
        });
        console.log('Booking updated:', response.data);
        setBookings((prevBookings) =>
          prevBookings.map((b) => (b._id === currentBooking._id ? response.data.booking : b))
        );
        setIsModalVisible(false);
      } catch (err) {
        console.error('Error updating booking:', err);
        Alert.alert('Error', 'Failed to update booking');
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (booking) => {
    Alert.alert(
      'Delete Booking',
      `Are you sure you want to delete booking for ${booking.propertyName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await axios.delete(`http://192.168.0.102:3000/slots/booking/${booking._id}`);
              console.log('Booking deleted:', response.data);
              setBookings((prevBookings) => prevBookings.filter((b) => b._id !== booking._id));
            } catch (err) {
              console.error('Error deleting booking:', err);
              Alert.alert('Error', 'Failed to delete booking');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#FF5733" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.username}>Welcome: {username}</Text>

      <Text style={styles.sectionTitle}>Booking History:</Text>
      {bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <View key={index} style={styles.booking}>
            <Text style={styles.bookingText}>Property: {booking.propertyName}</Text>
            <Text style={styles.bookingText}>Date: {new Date(booking.date).toDateString()}</Text>
            <Text style={styles.bookingText}>Time: {booking.time}</Text>
            <Text style={styles.bookingText}>Status: {booking.status}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleEdit(booking)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(booking)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noBookings}>No bookings found</Text>
      )}

      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Booking</Text>
          <DatePicker 
            date={newDate || new Date()}
            onDateChange={setNewDate}
          />
          <Picker
            selectedValue={newTime}
            onValueChange={(itemValue) => setNewTime(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Time" value="" />
            {[...Array(24).keys()].map((hour) => (
              <Picker.Item key={hour} label={`${hour}:00`} value={`${hour}:00`} />
            ))}
          </Picker>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          {bookingMessage ? <Text style={styles.bookingMessage}>{bookingMessage}</Text> : null}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF5733',
    marginBottom: 15,
  },
  booking: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  bookingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginTop: 15,
    backgroundColor: '#f8f9fa',
  },
  bookingMessage: {
    marginTop: 15,
    fontSize: 16,
    color: '#007bff',
    textAlign: 'center',
  },
  noBookings: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default ProfilePage;
