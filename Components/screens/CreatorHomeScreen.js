import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const CreatorHomeScreen = ({ onNavigate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Organization Name</Text>
      <Button title="Go to Creator Screen" onPress={onNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    margin: 10,
  },
});

export default CreatorHomeScreen;


// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
// import RNFS from 'react-native-fs';

// const CreatorHomeScreen = ({ onNavigate }) => {
//   const [organizationData, setOrganizationData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [organizationName, setOrganizationName] = useState('');
//   const [username, setUsername] = useState('');

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
//         const response = await fetch(`http://192.168.134.91:3000/user/getuserorganisation/${username}`);

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
//         const response = await fetch(`http://192.168.134.91:3000/organisation/organisation/${organizationName}`);

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

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#00ff00" />
//       </View>
//     );
//   }

//   const renderItem = ({ item }) => (
//     <View style={styles.buttonContainer}>
//       <Button
//         title={item}
//         onPress={() => onNavigate(item)}
//         color="#007BFF"
//       />
//     </View>
//   );

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.text}>Organization: {organizationName}</Text>
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

// export default CreatorHomeScreen;
