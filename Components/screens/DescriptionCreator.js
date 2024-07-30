import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

const DescriptionCreator = ({ propertyName, navigateBack }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [propertyData, setPropertyData] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const fetchPropertyData = async () => {
    try {
      const response = await fetch(`http://192.168.174.72:3000/childproperty/child-property/${propertyName}`);
      if (response.status === 200) {
        const data = await response.json();
        setPropertyData(data);
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      setMessage('Error fetching property data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    if (selectedDate) {
      setSelectedDates([...selectedDates, selectedDate]);
    }
  };

  const handleConfirm = () => {
    console.log('Dates confirmed:', selectedDates);
    // Add your logic to save the selected dates to the database
  };

  useEffect(() => {
    if (propertyName) {
      fetchPropertyData();
    } else {
      setMessage('Property name is missing.');
      setLoading(false);
    }
  }, [propertyName]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/300x200.png?text=Property+Image' }} // Placeholder image URL
              style={styles.propertyImage}
            />
          </View>
          <View style={styles.propertyDetails}>
            <Text style={styles.propertyName}>{propertyData?.ChildPropertyName}</Text>
            <Text style={styles.propertyLocation}>{propertyData?.Location}</Text>
            <Text style={styles.propertyDescription}>{propertyData?.Description}</Text>
            <View style={styles.ownerInfo}>
              <Image
                source={{ uri: 'https://via.placeholder.com/50.png?text=Owner' }} // Placeholder owner image
                style={styles.ownerImage}
              />
              <Text style={styles.ownerName}>{propertyData?.BuilderName}</Text>
            </View>
            <Text style={styles.propertyPrice}>{propertyData?.Price}</Text>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Map Placeholder</Text>
            </View>
            <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleAddDate}
              />
            )}
            <Button title="Confirm Dates" onPress={handleConfirm} />
          </View>
          <Button title="Back" onPress={navigateBack} />
        </>
      )}
      {message ? <Text>{message}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F0F0',
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  propertyDetails: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
  },
  propertyName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  propertyDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ownerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  mapPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  mapPlaceholderText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default DescriptionCreator;
