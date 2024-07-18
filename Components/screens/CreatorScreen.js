import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, TextInput, ScrollView, Image } from 'react-native';
import AWS from 'aws-sdk';
import { Buffer } from 'buffer';

const CreatorScreen = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [organisationData, setOrganisationData] = useState(null);
  const [propertyData, PropertyName] = useState([]); // State for property data as an array

  // AWS S3 Configuration
  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
  });

  const s3 = new AWS.S3();

  const fetchImageFromS3 = async () => {
    try {
      console.log('Fetching image from S3...');
      const params = {
        Bucket: 'ignitens', // Replace with your S3 bucket name
        Key: 'nepal/loyal/helloVilla/images/3.png_20240716192908476_7888d3ba.jpeg', // Replace with your object key
      };
      const result = await s3.getObject(params).promise();
      const imageBase64 = Buffer.from(result.Body).toString('base64');
      setImageUrl(`data:image/png;base64,${imageBase64}`);
      console.log('Image downloaded successfully.');
    } catch (error) {
      console.error('Error fetching image from S3:', error);
    }
  };

  const fetchOrganisationData = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      console.log('Fetching organisation data...');
      const response = await fetch(`http://192.168.134.91:3000/organisation/organisation/nepal`);

      if (response.status === 200) {
        const data = await response.json();
        console.log('Fetched organisation data:', data);
        setOrganisationData(data);
        setOrganisationName(data.OrganisationName); // Set the organisation name
      } else {
        const errorText = await response.text();
        console.log('Error fetching organisation data:', errorText);
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching organisation data:', error);
      setMessage('Error fetching organisation data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.134.91:3000/parentproperty/loyal/child-properties');

      if (response.status === 200) {
        const data = await response.json();
        console.log('Fetched property data:', data);
        PropertyName(data); // Set the fetched property data
      } else {
        const errorText = await response.text();
        console.log('Error fetching property data:', errorText);
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching property data:', error);
      setMessage('Error fetching property data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImageFromS3();
    fetchOrganisationData();
    fetchPropertyData(); // Fetch property data on component mount
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Creator Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Organisation Name"
        value={organisationName}
        onChangeText={setOrganisationName}
      />
      <Button title="Fetch Organisation Data" onPress={fetchOrganisationData} />
      {loading && <ActivityIndicator size="large" color="#ffffff" />}
      {message ? <Text style={styles.text}>{message}</Text> : null}
  
      {organisationData && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Organisation Data:</Text>
          <Text style={styles.dataText}>{organisationData.OrganisationName}</Text>
        </View>
      )}

      {propertyData.length > 0 && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Property Data:</Text>
          <Text style={styles.dataText}>{propertyData}</Text>
        </View>
      )}
  
      <View style={styles.card}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Text style={styles.cardImagePlaceholderText}>No Image Available</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardSubtitle}>{organisationData ? organisationData.OrganisationName : 'Loading...'}</Text>
          {propertyData.length > 0 ? (
            <>
              <Text style={styles.cardTitle}>{propertyData}</Text>
              <View style={styles.cardDetails}>
                <Text style={styles.cardDetail}>4 Rooms</Text>
                <Text style={styles.cardDetail}>3 Bed</Text>
                <Text style={styles.cardDetail}>2 Bath</Text>
                <Text style={styles.cardDetail}>732 sqft</Text>
              </View>
              <Text style={styles.cardPrice}>$2500/month</Text>
            </>
          ) : (
            <Text style={styles.cardTitle}>Loading...</Text>
          )}
          <Button title="Read More" onPress={() => {}} style={styles.cardButton} />
        </View>
      </View>
  
      <Button title="Back" onPress={onBack} />
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
  input: {
    width: '80%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    color: 'white',
  },
  dataContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  dataText: {
    color: 'white',
    fontSize: 16,
  },
  card: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  cardImagePlaceholderText: {
    color: 'white',
    fontSize: 16,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardSubtitle: {
    marginBottom: 10,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 16,
  },
  cardPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: 'blue',
    color: 'white',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default CreatorScreen;
