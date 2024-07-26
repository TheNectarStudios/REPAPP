import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

const SlotsApproval = ({ organizationName }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('SlotsApproval screen organizationName:', organizationName);
    
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://192.168.11.144:3000/slots/bookings/organisation/${organizationName}`);

        if (response.status === 200) {
          const data = await response.json();
          setBookings(data);
        } else {
          const errorText = await response.text();
          setMessage(`Error: ${errorText}`);
        }
      } catch (error) {
        setMessage('Error fetching bookings: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [organizationName]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://192.168.11.144:3000/slots/booking/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', `Booking status updated to ${newStatus}`);
        // Optionally, refresh the bookings list
        const updatedBookings = bookings.map(booking => 
          booking._id === id ? { ...booking, status: newStatus } : booking
        );
        setBookings(updatedBookings);
      } else {
        const errorText = await response.text();
        Alert.alert('Error', `Failed to update booking status: ${errorText}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update booking status: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.bookingContainer}>
      <Text style={styles.bookingText}>Property: {item.propertyName}</Text>
      <Text style={styles.bookingText}>Date: {item.date}</Text>
      <Text style={styles.bookingText}>Time: {item.time}</Text>
      <Text style={styles.bookingText}>Status: {item.status}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.approveButton]} 
          onPress={() => handleStatusChange(item._id, 'confirmed')}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.rejectButton]} 
          onPress={() => handleStatusChange(item._id, 'rejected')}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookings</Text>
      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  bookingContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
  },
  bookingText: {
    fontSize: 16,
    color: 'black',
  },
  flatListContainer: {
    width: '100%',
  },
  message: {
    color: 'white',
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SlotsApproval;
