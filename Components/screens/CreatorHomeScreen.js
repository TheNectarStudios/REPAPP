import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import axios from 'axios';
import s3 from './../../awsConfig'; // Adjust the path as necessary



const CreatorHomeScreen = ({ onNavigate }) => {
  const [organizationData, setOrganizationData] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedPropertyName, setSelectedPropertyName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        console.log('Fetching username from AsyncStorage');
        const storedUsername = await AsyncStorage.getItem('username');
        console.log('Fetched username:', storedUsername);
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          console.log('Username not found in AsyncStorage.');
          setMessage('Username not found in AsyncStorage.');
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to fetch username from AsyncStorage:', e);
        setMessage('Failed to fetch username from AsyncStorage: ' + e.message);
        setLoading(false);
      }
    };
  
    fetchUsername();
  }, []);
  

  useEffect(() => {
    if (!username) {
      return;
    }

    const fetchOrganisationName = async () => {
      try {
        const response = await fetch(`http://192.168.11.144:3000/user/getuserorganisation/${username}`);

        if (response.status === 200) {
          const data = await response.json();
          setOrganizationName(data.organisationName);
        } else {
          const errorText = await response.text();
          setMessage(`Error: ${errorText}`);
        }
      } catch (error) {
        setMessage('Error fetching organisation data: ' + error.message);
      }
    };

    fetchOrganisationName();
  }, [username]);

  useEffect(() => {
    if (!organizationName) {
      return;
    }

    const fetchOrganisationData = async () => {
      try {
        const response = await fetch(`http://192.168.11.144:3000/organisation/organisation/${organizationName}`);

        if (response.status === 200) {
          const data = await response.json();
          setOrganizationData(data);
        } else {
          const errorText = await response.text();
          setMessage(`Error: ${errorText}`);
        }
      } catch (error) {
        setMessage('Error fetching organisation data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisationData();
  }, [organizationName]);

  const fetchImageFromS3 = async (organisationName, parentPropertyName, childPropertyName) => {
    if (!organisationName || !parentPropertyName || !childPropertyName) {
      console.error('Missing parameters for S3 key:', { organisationName, parentPropertyName, childPropertyName });
      return 'https://via.placeholder.com/300x200.png?text=Image+Not+Available';
    }
  
    const key = `${organisationName}/${parentPropertyName}/${childPropertyName}/images/thumbnail/thumbnail.jpg`;
    console.log('Fetching image with key:', key);
  
    try {
      const params = {
        Bucket: 'ignitens',
        Key: key,
        Expires: 30, // URL expiration time in seconds
      };
      const imageUrl = await s3.getSignedUrlPromise('getObject', params);
      console.log('Generated Image URL:', imageUrl); // Log the generated URL
      return imageUrl;
    } catch (error) {
      console.error('Error fetching image from S3:', error);
      return 'https://via.placeholder.com/300x200.png?text=Image+Not+Available';
    }
  }; 

  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      const path = RNFS.DocumentDirectoryPath + '/selectedChildProperty.json';
      const fileExists = await RNFS.exists(path);
      if (fileExists) {
        const fileContents = await RNFS.readFile(path, 'utf8');
        const { propertyName } = JSON.parse(fileContents);

        const response = await axios.get(`http://192.168.11.144:3000/childproperty/child-property/${propertyName}`);
        if (response.status === 200) {
          const data = response.data;
          setPropertyData(data);
          setSelectedPropertyName(data.ChildPropertyName);

          // Fetch the image using the fetched property data
          const imageUrl = await fetchImageFromS3(data.OrganisationName, data.ParentPropertyName, data.ChildPropertyName);
          setImageUrl(imageUrl);
        } else {
          const errorText = await response.text();
          setMessage(`Error: ${errorText}`);
        }
      } else {
        setMessage('Selected child property file does not exist.');
      }
    } catch (error) {
      setMessage('Error fetching property data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, []);

  

  const handleParentPropertyPress = async (propertyName) => {
    try {
      await Promise.all([
        RNFS.writeFile(RNFS.DocumentDirectoryPath + '/selectedProperty.json', JSON.stringify({ propertyName }), 'utf8'),
        RNFS.writeFile(RNFS.DocumentDirectoryPath + '/selectedOrganization.json', JSON.stringify({ organizationName }), 'utf8')
      ]);
      onNavigate('ParentPropertyList');
    } catch (e) {
      setMessage('Failed to save data: ' + e.message);
    }
  };

  const handleSlotsPress = () => {
    onNavigate('SlotsApproval', { organizationName });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: imageUrl || 'https://via.placeholder.com/150.png?text=Image' }}
        style={styles.itemImage}
      />
      <View style={styles.buttonContainer}>
        <Button
          title={item}
          onPress={() => handleParentPropertyPress(item)}
          color="#007BFF"
        />
      </View>
    </View>
  );

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
      </View>
      <View style={styles.block}>
        <Button title="Slots" onPress={handleSlotsPress} color="#007BFF" />
      </View>
      <View style={styles.block}>
        {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : (
          <FlatList
            data={organizationData?.Properties || []}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.flatListContainer}
          />
        )}
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
    elevation: 5, // For Android shadow effect
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
  flatListContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // For Android shadow effect
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default CreatorHomeScreen;
