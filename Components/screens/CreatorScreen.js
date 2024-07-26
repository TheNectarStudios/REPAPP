import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Button } from 'react-native';
import RNFS from 'react-native-fs';
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

  if (showDescription) {
    return <DescriptionCreator propertyName={selectedPropertyName} navigateBack={() => setShowDescription(false)} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Creator Screen</Text>
      {loading && <ActivityIndicator size="large" color="#ffffff" />}
      {message ? <Text style={styles.text}>{message}</Text> : null}

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
            <Button title="Read More" onPress={() => setShowDescription(true)} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: 'white',
    margin: 10,
  },
  card: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImagePlaceholderText: {
    color: '#888',
    fontSize: 16,
  },
  cardContent: {
    padding: 15,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  cardDetail: {
    fontSize: 14,
    color: '#888',
    marginRight: 10,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});

export default CreatorScreen;
