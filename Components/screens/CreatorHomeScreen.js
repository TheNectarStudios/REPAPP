import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CreatorHomeScreen = ({ onNavigate }) => {
  const [username, setUsername] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          setMessage('Username not found in AsyncStorage.');
          setLoading(false);
        }
      } catch (e) {
        setMessage('Failed to fetch username from AsyncStorage: ' + e.message);
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    if (!username) return;

    const fetchOrganisationName = async () => {
      try {
        const response = await axios.get(`http://192.168.0.102:3000/user/getuserorganisation/${username}`);
        if (response.status === 200) {
          const data = response.data;
          setOrganizationName(data.organisationName);

          // Store the organization name in AsyncStorage
          await AsyncStorage.setItem('organizationName', data.organisationName);
        } else {
          setMessage(`Error fetching organisation: ${response.statusText}`);
        }
      } catch (error) {
        setMessage('Error fetching organisation data: ' + error.message);
      }
    };

    fetchOrganisationName();
  }, [username]);

  useEffect(() => {
    if (!organizationName) return;

    const fetchPropertyData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://192.168.0.102:3000/organisation/organisation/${organizationName}`);
        if (response.status === 200) {
          setPropertyData(response.data);
        } else {
          setMessage(`Error fetching property data: ${response.statusText}`);
        }
      } catch (error) {
        setMessage('Error fetching property data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [organizationName]);

  const handleButtonPress = async (property) => {
    try {
      await AsyncStorage.setItem('parentPropertyName', property);
      console.log(`Selected Parent Property: ${property}`);
      if (onNavigate) onNavigate('ParentPropertyList');
    } catch (error) {
      setMessage('Error storing property data: ' + error.message);
    }
  };

  const handleSlotsButtonPress = () => {
    if (onNavigate) onNavigate('SlotsApproval'); // Navigate to the SlotsApproval screen
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.block}>
        <Text style={styles.title}>Organization: {organizationName}</Text>
        {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : (
          propertyData?.Properties?.map((property, index) => (
            <View key={index} style={styles.propertyButton}>
              <Button
                title={property}
                onPress={() => handleButtonPress(property)}
                color="#007BFF"
              />
            </View>
          ))
        )}
        <View style={styles.slotsButtonContainer}>
          <Button
            title="Slots"
            onPress={handleSlotsButtonPress}
            color="#007BFF"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  block: {
    marginVertical: 20,
    padding: 15,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
  },
  propertyButton: {
    marginVertical: 10,
    width: '100%',
  },
  slotsButtonContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default CreatorHomeScreen;


