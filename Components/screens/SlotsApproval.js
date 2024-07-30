// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const SlotsApproval = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [organizationName, setOrganizationName] = useState('');

//   useEffect(() => {
//     const fetchOrganizationName = async () => {
//       try {
//         const storedOrganizationName = await AsyncStorage.getItem('organizationName');
//         if (storedOrganizationName) {
//           setOrganizationName(storedOrganizationName);
//         } else {
//           setMessage('Organization name not found in AsyncStorage.');
//           setLoading(false);
//         }
//       } catch (error) {
//         setMessage('Failed to fetch organization name from AsyncStorage: ' + error.message);
//         setLoading(false);
//       }
//     };

//     fetchOrganizationName();
//   }, []);

//   useEffect(() => {
//     if (!organizationName) return;

//     const fetchBookings = async () => {
//       try {
//         const response = await fetch(`http://192.168.174.72:3000/slots/bookings/organisation/${organizationName}`);

//         if (response.status === 200) {
//           const data = await response.json();
//           setBookings(data);
//         } else {
//           const errorText = await response.text();
//           setMessage(`Error: ${errorText}`);
//         }
//       } catch (error) {
//         setMessage('Error fetching bookings: ' + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [organizationName]);

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       const response = await fetch(`http://192.168.174.72:3000/slots/booking/${id}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         const updatedBookings = bookings.map((booking) =>
//           booking._id === id ? { ...booking, status: newStatus } : booking
//         );
//         setBookings(updatedBookings);
//       } else {
//         const errorText = await response.text();
//         Alert.alert('Error', `Failed to update booking status: ${errorText}`);
//       }
//     } catch (error) {
//       Alert.alert('Error', `Failed to update booking status: ${error.message}`);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#FF5733" />
//       </View>
//     );
//   }

//   const renderItem = ({ item }) => (
//     <View style={styles.bookingContainer}>
//       <Text style={styles.bookingText}>Property: {item.propertyName}</Text>
//       <Text style={styles.bookingText}>Date: {item.date}</Text>
//       <Text style={styles.bookingText}>Time: {item.time}</Text>
//       <Text style={styles.bookingText}>Status: {item.status}</Text>
//       {item.status === 'confirmed' && (
//         <Text style={styles.bookingText}>Room ID: {item.RoomId}</Text>
//       )}
//       <View style={styles.buttonsContainer}>
//         <TouchableOpacity
//           style={[styles.button, styles.approveButton]}
//           onPress={() => handleStatusChange(item._id, 'confirmed')}
//         >
//           <Text style={styles.buttonText}>Approve</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.button, styles.rejectButton]}
//           onPress={() => handleStatusChange(item._id, 'rejected')}
//         >
//           <Text style={styles.buttonText}>Reject</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Bookings</Text>
//       {message ? (
//         <Text style={styles.message}>{message}</Text>
//       ) : (
//         <FlatList
//           data={bookings}
//           renderItem={renderItem}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={styles.flatListContainer}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   bookingContainer: {
//     marginVertical: 10,
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   bookingText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 8,
//   },
//   flatListContainer: {
//     paddingBottom: 20,
//   },
//   message: {
//     color: '#333',
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   buttonsContainer: {
//     flexDirection: 'row',
//     marginTop: 15,
//   },
//   button: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     marginHorizontal: 5,
//     alignItems: 'center',
//     elevation: 2,
//   },
//   approveButton: {
//     backgroundColor: '#28a745',
//   },
//   rejectButton: {
//     backgroundColor: '#dc3545',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default SlotsApproval;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

const SlotsApproval = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  useEffect(() => {
    const fetchOrganizationName = async () => {
      try {
        const storedOrganizationName = await AsyncStorage.getItem('organizationName');
        if (storedOrganizationName) {
          setOrganizationName(storedOrganizationName);
        } else {
          setMessage('Organization name not found in AsyncStorage.');
          setLoading(false);
        }
      } catch (error) {
        setMessage('Failed to fetch organization name from AsyncStorage: ' + error.message);
        setLoading(false);
      }
    };

    fetchOrganizationName();
  }, []);

  useEffect(() => {
    if (!organizationName) return;

    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://192.168.174.72:3000/slots/bookings/organisation/${organizationName}`);

        if (response.status === 200) {
          const data = await response.json();
          setBookings(data);
        } else {
          const errorText = await response.text();
          setMessage(`Error: ${errorText}`);
        }
      } catch (error) {
        setMessage('Error fetching bookings: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [organizationName]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://192.168.174.72:3000/slots/booking/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        const updatedBookings = bookings.map((booking) =>
          booking._id === id ? { ...booking, status: newStatus } : booking
        );
        setBookings(updatedBookings);
      } else {
        const errorText = await response.text();
        Alert.alert('Error', `Failed to update booking status: ${errorText}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update booking status: ${error.message}`);
    }
  };

  const handleJoinVideoCall = (propertyName) => {
    const videoCallUrl = `https://meet.jit.si/your-meeting-room-${propertyName}`;
    Linking.openURL(videoCallUrl).catch(err => Alert.alert('Error', 'Failed to open video call: ' + err.message));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.bookingContainer}>
      <Text style={styles.bookingText}>Property: {item.propertyName}</Text>
      <Text style={styles.bookingText}>Date: {item.date}</Text>
      <Text style={styles.bookingText}>Time: {item.time}</Text>
      <Text style={styles.bookingText}>Status: {item.status}</Text>
      {item.status === 'confirmed' && (
        <Text style={styles.bookingText}>Room ID: {item.RoomId}</Text>
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => handleStatusChange(item._id, 'confirmed')}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleStatusChange(item._id, 'rejected')}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.videoCallButton]}
          onPress={() => handleJoinVideoCall(item.propertyName)}
        >
          <Text style={styles.buttonText}>Join Video Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookings</Text>
      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  bookingContainer: {
    marginVertical: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  bookingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  message: {
    color: '#333',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  videoCallButton: {
    backgroundColor: '#007bff', // Adjust the color as needed
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SlotsApproval;

