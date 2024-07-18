import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';

const HomeScreen = () => {
  const [location, setLocation] = useState('Pune');
  const [searchQuery, setSearchQuery] = useState('');

  const houses = [
    {
      id: '1',
      name: 'Dreamsville House',
      distance: '1.8 km',
      address: 'Jl. Sultan Iskandar Muda',
      price: 'Rp. 2.500',
      bedrooms: 6,
      bathrooms: 4,
    },
    {
      id: '2',
      name: 'Ascot House',
      distance: '2.5 km',
      address: 'Jl. Cilandak',
      price: 'Rp. 3.000',
      bedrooms: 5,
      bathrooms: 3,
    },
    {
      id: '3',
      name: 'Orchad House',
      distance: '3.2 km',
      address: 'Jl. Sudirman',
      price: 'Rp. 2.500',
      bedrooms: 6,
      bathrooms: 4,
    },
    {
      id: '4',
      name: 'The Hollies House',
      distance: '1.1 km',
      address: 'Jl. Gatot Subroto',
      price: 'Rp. 2.500',
      bedrooms: 5,
      bathrooms: 2,
    },
  ];

  const handleSearch = () => {
    // Implement search logic here
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.houseItem} onPress={() => { }}>
      <View style={styles.houseInfo}>
        <Text style={styles.houseName}>{item.name}</Text>
        <Text style={styles.houseDistance}>{item.distance}</Text>
        <Text style={styles.housePrice}>{item.price}</Text>
        <View style={styles.houseDetails}>
          <Text style={styles.houseDetail}>
            {item.bedrooms} Bedrooms
          </Text>
          <Text style={styles.houseDetail}>
            {item.bathrooms} Bathrooms
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.locationText}>{location}</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Text>Notification</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search address, or near you"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categoriesContainer}>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>House</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Apartment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Hotel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Villa</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Near from you</Text>
      <FlatList
        data={houses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <Text style={styles.sectionTitle}>Best for you</Text>
      <FlatList
        data={houses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationIcon: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  houseItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  houseInfo: {
    flex: 1,
  },
  houseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  houseDistance: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  housePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  houseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  houseDetail: {
    fontSize: 14,
    color: 'gray ',
  },
});

export default HomeScreen;