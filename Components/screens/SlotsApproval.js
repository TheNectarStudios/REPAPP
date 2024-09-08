import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
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

    const fetchWatchlist = async () => {
      try {
        const response = await fetch(`https://theserver-tp6r.onrender.com/slots/watchlist/${organizationName}`);
        
        if (response.status === 200) {
          const data = await response.json();
          if (Array.isArray(data.watchlist)) {
            const uniqueSlots = data.watchlist.reduce((acc, current) => {
              const x = acc.find(item => item.propertyName === current.propertyName);
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);
            setWatchlist(uniqueSlots);
          } else {
            setMessage('Unexpected data format, expected an array in data.watchlist.');
          }
        } else {
          const errorText = await response.text();
          setMessage(`Error: ${errorText}`);
        }
      } catch (error) {
        setMessage('Error fetching watchlist: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [organizationName]);

  const handleJoinVideoCall = (propertyName) => {
    const videoCallUrl = `https://meet.jit.si/your-meeting-room-${propertyName}`;
    Linking.openURL(videoCallUrl).catch(err => Alert.alert('Error', 'Failed to open video call: ' + err.message));
  };

  const updateSlotApproval = async (propertyName, parentPropertyName, status) => {
    try {
      const response = await fetch(`https://theserver-tp6r.onrender.com/slots/bookings/approve/${propertyName}/${parentPropertyName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvalStatus: status }),
      });
  
      if (response.ok) {
        // Update only the specific slot in the local state without reloading the entire list
        const updatedWatchlist = watchlist.map(slot => {
          if (slot.propertyName === propertyName && slot.parentPropertyName === parentPropertyName) {
            return { ...slot, ApprovalStatus: status };
          }
          return slot;
        });
        setWatchlist(updatedWatchlist);
  
        // Display a small message for feedback
        Alert.alert('Success', `Slot ${status} successfully!`);
      } else {
        const errorText = await response.text();
        Alert.alert('Error', `Failed to update slot: ${errorText}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update approval status: ${error.message}`);
    }
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.slotContainer}>
      <Text style={styles.slotText}>Property: {item.propertyName}</Text>
      <Text style={styles.slotText}>Parent Property: {item.parentPropertyName}</Text>
      <Text style={styles.slotText}>Date: {item.date}</Text>
      <Text style={styles.slotText}>Time: {item.time}</Text>
      <Text style={styles.slotText}>Approval Status: {item.ApprovalStatus || 'Pending'}</Text>
      {item.imageURL && (
        <Image source={{ uri: item.imageURL }} style={styles.slotImage} />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#28a745' }]}
          onPress={() => updateSlotApproval(item.propertyName, item.parentPropertyName, 'Approved')}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#dc3545' }]}
          onPress={() => updateSlotApproval(item.propertyName, item.parentPropertyName, 'Rejected')}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.videoCallButton}
        onPress={() => handleJoinVideoCall(item.propertyName)}
      >
        <Text style={styles.buttonText}>Join Video Call</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Watchlist</Text>
      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <FlatList
          data={watchlist}
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
  slotContainer: {
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
  slotText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  slotImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 0.48,
  },
  videoCallButton: {
    marginTop: 15,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Watchlist;
