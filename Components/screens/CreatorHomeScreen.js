
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNFS from 'react-native-fs';

// const CreatorHomeScreen = ({ onNavigate }) => {
//   const [organizationData, setOrganizationData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [organizationName, setOrganizationName] = useState('');
//   const [username, setUsername] = useState('');

//   useEffect(() => {
//     const fetchUsername = async () => {
//       try {
//         const storedUsername = await AsyncStorage.getItem('username');
//         if (storedUsername) {
//           setUsername(storedUsername);
//           console.log('Username fetched from AsyncStorage:', storedUsername);
//         } else {
//           console.log('Username not found in AsyncStorage.');
//           setMessage('Username not found in AsyncStorage.');
//           setLoading(false);
//         }
//       } catch (e) {
//         console.error('Failed to fetch username from AsyncStorage:', e);
//         setMessage('Failed to fetch username from AsyncStorage: ' + e.message);
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
//         const response = await fetch(`http://192.168.0.102:3000/user/getuserorganisation/${username}`);

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
//         const response = await fetch(`http://192.168.0.102:3000/organisation/organisation/${organizationName}`);

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

//   const handleParentPropertyPress = async (propertyName) => {
//     try {
//       // Save both propertyName and organizationName using AsyncStorage
//       await Promise.all([
//         RNFS.writeFile(RNFS.DocumentDirectoryPath + '/selectedProperty.json', JSON.stringify({ propertyName: propertyName }), 'utf8'),
//         RNFS.writeFile(RNFS.DocumentDirectoryPath + '/selectedOrganization.json', JSON.stringify({ organizationName: organizationName }), 'utf8')
//       ]);
//       onNavigate('ParentPropertyList'); // Call onNavigate to switch screen
//     } catch (e) {
//       console.error('Failed to save data:', e);
//       Alert.alert('Error', 'Failed to save data.');
//     }
//   };

//   const handleSlotsPress = () => {
//     console.log('Navigating to SlotsApproval with organizationName:', organizationName);
//     onNavigate('SlotsApproval', { organizationName }); // Call onNavigate to switch screen
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.buttonContainer}>
//       <Button
//         title={item}
//         onPress={() => handleParentPropertyPress(item)}
//         color="#007BFF"
//       />
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#00ff00" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.text}>Organization: {organizationName}</Text>
//       <Button title="Slots" onPress={handleSlotsPress} color="#007BFF" />
//       {message ? (
//         <Text style={styles.text}>{message}</Text>
//       ) : (
//         <FlatList
//           data={organizationData?.Properties || []}
//           renderItem={renderItem}
//           keyExtractor={(item) => item}
//           contentContainerStyle={styles.flatListContainer}
//         />
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
//   flatListContainer: {
//     width: '100%',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     marginVertical: 10,
//     width: '80%',
//   },
// });

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, ScrollView } from 'react-native';
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
    if (!username) {
      return;
    }

    const fetchOrganisationName = async () => {
      try {
        const response = await fetch(`http://192.168.0.102:3000/user/getuserorganisation/${username}`);

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
        const response = await fetch(`http://192.168.0.102:3000/organisation/organisation/${organizationName}`);

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
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  message: {
    color: '#ff0000',
    fontSize: 16,
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
