import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import axios from 'axios';
import s3 from './../../awsConfig'; // Import the AWS configuration
import DescriptionPage from './DescriptionPage'; // Import DescriptionPage
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [cities, setCities] = useState([]);

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
      setFilteredHouses(housesWithImages); // Initialize filteredHouses with all houses

      // Extract unique cities from the houses data
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
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleReadMore(item)}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          onError={(e) => console.error('Image loading error:', e.nativeEvent.error)}
        />
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
          <Text>Notification</Text>
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
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20, // Increased margin to avoid overlap
    marginBottom: 20,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationIcon: {
    // Add styles for notification icon if needed
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
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
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 10,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  propertyDetail: {
    fontSize: 14,
    color: '#888',
  },
  propertyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  stat: {
    fontSize: 12,
    color: '#888',
  },
  readMoreButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  readMoreText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomeScreen;
