import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import s3 from './../../awsConfig';
import DescriptionPage from './DescriptionPage';

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
      Expires: 30,
    };
    const imageUrl = await s3.getSignedUrlPromise('getObject', params);
    console.log('Generated Image URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image from S3:', error);
    return 'https://via.placeholder.com/300x200.png?text=Image+Not+Available';
  }
};

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    fetchHouses();
  }, []);

  useEffect(() => {
    filterHouses();
  }, [searchQuery, houses]);

  const fetchHouses = async () => {
    try {
      const response = await axios.get('https://theserver-tp6r.onrender.com/childproperty/child-properties');
      const housesWithImages = await Promise.all(response.data.map(async (property) => {
        const imageUrl = await fetchImageFromS3(property.OrganisationName, property.ParentPropertyName, property.ChildPropertyName);
        return { ...property, imageUrl };
      }));
      setHouses(housesWithImages);
      setFilteredHouses(housesWithImages);

      const uniqueCities = [...new Set(housesWithImages.map(house => house.Location))];
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error fetching houses:', error);
    }
  };

  const filterHouses = () => {
    const query = searchQuery.toLowerCase();
    const filtered = houses.filter((house) => {
      const childPropertyName = house.ChildPropertyName?.toLowerCase() || '';
      const parentPropertyName = house.ParentPropertyName?.toLowerCase() || '';
      const location = house.Location?.toLowerCase() || '';
      return childPropertyName.includes(query) || parentPropertyName.includes(query) || location.includes(query);
    });

    setFilteredHouses(filtered);
  };

  const handleSearch = () => {
    filterHouses();
  };

  const handleReadMore = (property) => {
    setSelectedProperty(property);
  };

  const renderItem = ({ item }) => {
    const isLoading = loadingStates[item.ChildPropertyName] || false;

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleReadMore(item)}>
        <View style={styles.imageContainer}>
          {isLoading && (
            <ActivityIndicator style={styles.loadingIndicator} size="large" color="#007BFF" />
          )}
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            onLoadStart={() => {
              setLoadingStates(prevState => ({
                ...prevState,
                [item.ChildPropertyName]: true,
              }));
            }}
            onLoad={() => {
              setLoadingStates(prevState => ({
                ...prevState,
                [item.ChildPropertyName]: false,
              }));
            }}
            onError={(e) => {
              console.error('Image loading error:', e.nativeEvent.error);
              setLoadingStates(prevState => ({
                ...prevState,
                [item.ChildPropertyName]: false,
              }));
            }}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.propertyName}>{item.ChildPropertyName}</Text>
          <Text style={styles.propertyPrice}>{item.Price}</Text>
          <Text style={styles.propertyDetail}>Area: {item.Area}</Text>
          <View style={styles.propertyStats}>
            <Text style={styles.stat}>Bath: {item.Bath}</Text>
            <Text style={styles.stat}>Bed: {item.Bedroom}</Text>
            <Text style={styles.stat}>Room: {item.Room}</Text>
          </View>
          <TouchableOpacity style={styles.readMoreButton} onPress={() => handleReadMore(item)}>
            <Text style={styles.readMoreText}>Read More</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (selectedProperty) {
    return (
      <DescriptionPage property={selectedProperty} setSelectedProperty={setSelectedProperty} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.locationText}>{searchQuery}</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Text style={styles.notificationText}>🔔</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by property name, location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredHouses}
        renderItem={renderItem}
        keyExtractor={(item) => item.ChildPropertyName}
        contentContainerStyle={styles.cardContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationIcon: {
    padding: 10,
  },
  notificationText: {
    fontSize: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    elevation: 2, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cardContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  propertyPrice: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  propertyDetail: {
    fontSize: 14,
    marginBottom: 10,
    color: '#777',
  },
  propertyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stat: {
    fontSize: 14,
    color: '#666',
  },
  readMoreButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
  },
  readMoreText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default HomeScreen;
