// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
// import RNFS from 'react-native-fs';

// const CreatorHomeScreen = ({ onNavigate }) => {
//   const [organizationData, setOrganizationData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [organizationName, setOrganizationName] = useState('');
//   const [username, setUsername] = useState('');
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     const fetchUsername = async () => {
//       const path = RNFS.DocumentDirectoryPath + '/user.json';

//       try {
//         const fileExists = await RNFS.exists(path);
//         if (fileExists) {
//           const user = await RNFS.readFile(path, 'utf8');
//           const { username } = JSON.parse(user);
//           setUsername(username);
//           console.log('Username fetched from file:', username);
//         } else {
//           console.log('Username file does not exist.');
//           setMessage('Username file does not exist.');
//           setLoading(false);
//         }
//       } catch (e) {
//         console.error('Failed to fetch username from file:', e);
//         setMessage('Failed to fetch username from file: ' + e.message);
//         setLoading(false);
//       }
//     };

//     fetchUsername();
//   }, []);

//   useEffect(() => {
//     if (!username) {
//       return;
//     }

//     const fetchOrganisationName = async () => {
//       try {
//         const response = await fetch(`http://192.168.11.144:3000/user/getuserorganisation/${username}`);

//         if (response.status === 200) {
//           const data = await response.json();
//           setOrganizationName(data.organisationName);
//           Alert.alert('Fetched organisation data:', JSON.stringify(data));
//         } else {
//           const errorText = await response.text();
//           setMessage(`Error: ${errorText}`);
//         }
//       } catch (error) {
//         setMessage('Error fetching organisation data: ' + error.message);
//       }
//     };

//     fetchOrganisationName();
//   }, [username]);

//   useEffect(() => {
//     if (!organizationName) {
//       return;
//     }

//     const fetchOrganisationData = async () => {
//       try {
//         const response = await fetch(`http://192.168.11.144:3000/organisation/organisation/${organizationName}`);

//         if (response.status === 200) {
//           const data = await response.json();
//           setOrganizationData(data);
//           Alert.alert('Fetched organisation data:', JSON.stringify(data));
//         } else {
//           const errorText = await response.text();
//           setMessage(`Error: ${errorText}`);
//         }
//       } catch (error) {
//         setMessage('Error fetching organisation data: ' + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrganisationData();
//   }, [organizationName]);

//   useEffect(() => {
//     if (!organizationName) {
//       return;
//     }

//     const fetchBookings = async () => {
//       try {
//         const response = await fetch(`http://192.168.11.144:3000/slots/bookings/organisation/${organizationName}`);

//         if (response.status === 200) {
//           const data = await response.json();
//           setBookings(data);
//         } else {
//           const errorText = await response.text();
//           setMessage(`Error: ${errorText}`);
//         }
//       } catch (error) {
//         setMessage('Error fetching bookings: ' + error.message);
//       }
//     };

//     fetchBookings();
//   }, [organizationName]);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#00ff00" />
//       </View>
//     );
//   }

//   const handleParentPropertyPress = async (propertyName) => {
//     const path = RNFS.DocumentDirectoryPath + '/selectedProperty.json';
//     try {
//       await RNFS.writeFile(path, JSON.stringify({ propertyName }), 'utf8');
//       onNavigate('ParentPropertyList');
//     } catch (e) {
//       console.error('Failed to write property name to file:', e);
//     }
//   };

//   const renderPropertyItem = ({ item }) => (
//     <View style={styles.buttonContainer}>
//       <Button
//         title={item}
//         onPress={() => handleParentPropertyPress(item)}
//         color="#007BFF"
//       />
//     </View>
//   );

//   const renderBookingItem = ({ item }) => (
//     <View style={styles.bookingContainer}>
//       <Text style={styles.bookingText}>Booking ID: {item._id}</Text>
//       <Text style={styles.bookingText}>Property: {item.propertyName}</Text>
//       <Text style={styles.bookingText}>Date: {item.date}</Text>
//       <Text style={styles.bookingText}>Time: {item.time}</Text>
//       <Text style={styles.bookingText}>Status: {item.status}</Text>
//     </View>
//   );

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.text}>Organization: {organizationName}</Text>
//       {message ? (
//         <Text style={styles.text}>{message}</Text>
//       ) : (
//         <>
//           <FlatList
//             data={organizationData?.Properties || []}
//             renderItem={renderPropertyItem}
//             keyExtractor={(item) => item}
//             contentContainerStyle={styles.flatListContainer}
//           />
//           <Text style={styles.heading}>Bookings:</Text>
//           <FlatList
//             data={bookings}
//             renderItem={renderBookingItem}
//             keyExtractor={(item) => item._id}
//             contentContainerStyle={styles.flatListContainer}
//           />
//         </>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   text: {
//     color: 'white',
//     margin: 10,
//     fontSize: 18,
//   },
//   heading: {
//     color: 'white',
//     fontSize: 22,
//     marginVertical: 20,
//   },
//   flatListContainer: {
//     width: '100%',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     marginVertical: 10,
//     width: '80%',
//   },
//   bookingContainer: {
//     marginVertical: 10,
//     padding: 10,
//     backgroundColor: '#444',
//     borderRadius: 5,
//     width: '90%',
//   },
//   bookingText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });

// export default CreatorHomeScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

const CreatorHomeScreen = ({ onNavigate }) => {
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
          console.log('Username fetched from AsyncStorage:', storedUsername);
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
          Alert.alert('Fetched organisation data:', JSON.stringify(data));
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
          Alert.alert('Fetched organisation data:', JSON.stringify(data));
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

  const handleParentPropertyPress = async (propertyName) => {
    try {
      // Save both propertyName and organizationName using AsyncStorage
      await Promise.all([
        RNFS.writeFile(RNFS.DocumentDirectoryPath + '/selectedProperty.json', JSON.stringify({ propertyName: propertyName }), 'utf8'),
        RNFS.writeFile(RNFS.DocumentDirectoryPath + '/selectedOrganization.json', JSON.stringify({ organizationName: organizationName }), 'utf8')
      ]);
      onNavigate('ParentPropertyList'); // Call onNavigate to switch screen
    } catch (e) {
      console.error('Failed to save data:', e);
      Alert.alert('Error', 'Failed to save data.');
    }
  };

  const handleSlotsPress = () => {
    console.log('Navigating to SlotsApproval with organizationName:', organizationName);
    onNavigate('SlotsApproval', { organizationName }); // Call onNavigate to switch screen
  };

  const renderItem = ({ item }) => (
    <View style={styles.buttonContainer}>
      <Button
        title={item}
        onPress={() => handleParentPropertyPress(item)}
        color="#007BFF"
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Organization: {organizationName}</Text>
      <Button title="Slots" onPress={handleSlotsPress} color="#007BFF" />
      {message ? (
        <Text style={styles.text}>{message}</Text>
      ) : (
        <FlatList
          data={organizationData?.Properties || []}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: 'white',
    margin: 10,
    fontSize: 18,
  },
  flatListContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});

export default CreatorHomeScreen;
