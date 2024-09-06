import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import s3 from './../../awsConfig'; // Import the AWS configuration
import DescriptionCreator from './DescriptionCreator'; // Adjust the path as necessary

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

const CreatorScreen = ({ navigateTo }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [propertyData, setPropertyData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [selectedPropertyName, setSelectedPropertyName] = useState('');

  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      const storedPropertyName = await AsyncStorage.getItem('childPropertyName');
      if (storedPropertyName) {
        setSelectedPropertyName(storedPropertyName);

        const response = await axios.get(`https://theserver-tp6r.onrender.com/childproperty/child-property/${storedPropertyName}`);
        if (response.status === 200) {
          const data = response.data;
          setPropertyData(data);

          // Fetch the image using the fetched property data
          const imageUrl = await fetchImageFromS3(data.OrganisationName, data.ParentPropertyName, data.ChildPropertyName);
          setImageUrl(imageUrl);
        } else {
          const errorText = await response.text();
          setMessage(`Error: ${errorText}`);
        }
      } else {
        setMessage('Selected child property name not found in AsyncStorage.');
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

  const handleBackPress = () => {
    setShowDescription(false);  // Hide the description
  };

  if (showDescription) {
    return <DescriptionCreator propertyName={selectedPropertyName} navigateBack={handleBackPress} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Creator Screen</Text>
      {loading && <ActivityIndicator size="large" color="#ffffff" />}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {propertyData && (
        <View style={styles.card}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.cardImage} />
          ) : (
            <View style={styles.cardImagePlaceholder}>
              <Text style={styles.cardImagePlaceholderText}>No Image Available</Text>
            </View>
          )}
          <View style={styles.cardContent}>
            <Text style={styles.cardSubtitle}>{propertyData.OrganisationName}</Text>
            <Text style={styles.cardTitle}>{propertyData.ChildPropertyName}</Text>
            <View style={styles.cardDetails}>
              <Text style={styles.cardDetail}>{propertyData.Room} Rooms</Text>
              <Text style={styles.cardDetail}>{propertyData.Bedroom} Bed</Text>
              <Text style={styles.cardDetail}>{propertyData.Bath} Bath</Text>
              <Text style={styles.cardDetail}>{propertyData.Area}</Text>
            </View>
            <Text style={styles.cardPrice}>{propertyData.Price}</Text>
            <TouchableOpacity style={styles.readMoreButton} onPress={() => setShowDescription(true)}>
              <Text style={styles.readMoreButtonText}>Read More</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    margin: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  message: {
    color: '#FF6347',
    margin: 10,
    fontSize: 16,
  },
  card: {
    width: '90%',
    backgroundColor: '#333333',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5, // Add shadow on Android
    shadowColor: '#000', // Add shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#666666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImagePlaceholderText: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  cardContent: {
    padding: 15,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 5,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  cardDetail: {
    fontSize: 14,
    color: '#CCCCCC',
    marginRight: 10,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 5,
  },
  readMoreButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  readMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default CreatorScreen;

