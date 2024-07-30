import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import s3 from './../../awsConfig'; // Adjust the path as necessary

const fetchImageFromS3 = async () => {
  const manualKey = '123/RamanNivas/mayuriMahal/images/otherImages/Car1.jpg';

  console.log('Fetching image with manual key:', manualKey);

  try {
    const params = {
      Bucket: 'ignitens',
      Key: manualKey,
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

const ParentPropertyList = ({ navigateTo }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [parentPropertyName, setParentPropertyName] = useState('');
  const [propertyData, setPropertyData] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchParentPropertyName = async () => {
      try {
        const storedPropertyName = await AsyncStorage.getItem('parentPropertyName');
        if (storedPropertyName) {
          setParentPropertyName(storedPropertyName);
        } else {
          setMessage('Selected property name not found in AsyncStorage.');
          setLoading(false);
        }
      } catch (e) {
        setMessage('Failed to fetch property name from AsyncStorage: ' + e.message);
        setLoading(false);
      }
    };

    fetchParentPropertyName();
  }, []);

  useEffect(() => {
    if (!parentPropertyName) {
      return;
    }

    const fetchPropertyData = async () => {
      try {
        const response = await fetch(`http://192.168.174.72:3000/parentproperty/${parentPropertyName}/child-properties`);
        if (response.status === 200) {
          const data = await response.json();
          setPropertyData(data);

          // Fetch the image URL using the manual key
          const fetchedImageUrl = await fetchImageFromS3();
          setImageUrl(fetchedImageUrl);
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

    fetchPropertyData();
  }, [parentPropertyName]);

  const handleButtonPress = async (property) => {
    try {
      await AsyncStorage.setItem('childPropertyName', property);
      console.log(`Selected Child Property: ${property}`);
      navigateTo('CreatorScreen'); // Replace 'CreatorScreen' with the actual screen name you want to navigate to
    } catch (error) {
      setMessage('Error storing property data: ' + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingBlock}>
        <Text style={styles.headingText}>Parent Property List</Text>
      </View>
      {message ? (
        <Text style={styles.messageText}>{message}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {propertyData.map((property, index) => (
            <View key={index} style={styles.propertyBlock}>
              <Image
                source={{ uri: imageUrl || 'https://via.placeholder.com/150.png?text=Image' }}
                style={styles.itemImage}
                onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
              />
              <Button
                title={String(property)} // Ensure the title is a string
                onPress={() => handleButtonPress(property)}
                color="#007BFF"
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headingBlock: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  headingText: {
    fontSize: 24,
    color: 'black',
  },
  messageText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
  },
  propertyBlock: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default ParentPropertyList;


