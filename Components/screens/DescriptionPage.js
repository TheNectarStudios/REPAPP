import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import DatePicker from './DatePicker';

const DescriptionPage = ({ property, setSelectedProperty }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      setBookingMessage('Please select a date');
      return;
    }

    try {
      console.log('Booking property with ID:', property.id);

      const response = await fetch('http://192.168.0.102:3000/slots/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: '232',
          userId: 'USER_ID_PLACEHOLDER', // Replace with actual user ID
          date: selectedDate.toISOString(),
        }),
      });

      const data = await response.json();
      console.log('Booking API response:', data);

      if (response.ok) {
        setBookingMessage('Booking confirmed');
      } else {
        setBookingMessage(data.message || 'Failed to book property');
      }
    } catch (error) {
      console.error('Error booking property:', error);
      setBookingMessage('Error booking property: ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: property.imageUrl }} style={styles.image} />
      <Text style={styles.propertyName}>{property.ChildPropertyName}</Text>
      <Text style={styles.propertyPrice}>{property.Price}</Text>
      <Text style={styles.propertyDetail}>Area: {property.Area}</Text>
      <Text style={styles.propertyDescription}>{property.Description}</Text>
      <View style={styles.propertyStats}>
        <Text style={styles.stat}>Bath: {property.Bath}</Text>
        <Text style={styles.stat}>Bed: {property.Bedroom}</Text>
        <Text style={styles.stat}>Room: {property.Room}</Text>
      </View>

      <DatePicker 
        date={selectedDate || new Date()}
        onDateChange={handleDateChange}
      />

      {selectedDate && (
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      )}

      {bookingMessage ? <Text style={styles.bookingMessage}>{bookingMessage}</Text> : null}

      <TouchableOpacity style={styles.backButton} onPress={() => setSelectedProperty(null)}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  propertyPrice: {
    fontSize: 18,
    color: '#888',
    marginTop: 10,
  },
  propertyDetail: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  propertyDescription: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  propertyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  stat: {
    fontSize: 14,
    color: '#888',
  },
  bookButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  bookingMessage: {
    marginTop: 20,
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DescriptionPage;
