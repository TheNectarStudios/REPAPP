import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Modal from 'react-native-modal';
import DatePicker from './DatePicker';
import { Picker } from '@react-native-picker/picker';
import RtcEngine from 'react-native-agora';

const AGORA_APP_ID = '159d9ac65d1949e4a159d0bb2351e9ef';  // Replace with your Agora App ID

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [channelName, setChannelName] = useState('');
  const [userToken, setUserToken] = useState('');
  const [isVideoCallVisible, setIsVideoCallVisible] = useState(false);
  const [isAgoraInitialized, setIsAgoraInitialized] = useState(false);
  const agoraEngineRef = useRef(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          setError('No username found in storage');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching username from AsyncStorage:', err);
        setError('Failed to fetch username from storage');
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    if (username) {
      const fetchBookings = async () => {
        try {
          const response = await axios.get(`http://192.168.174.72:3000/slots/bookings/${username}`);
          console.log('API response:', response.data);
          if (response.data) {
            setBookings(response.data);
          } else {
            setError('No bookings found in response');
          }
        } catch (err) {
          console.error('Error fetching bookings:', err);
          setError('Failed to fetch bookings');
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [username]);

  useEffect(() => {
    const initAgoraEngine = async () => {
      try {
        console.log('Initializing Agora engine...');
        if (!agoraEngineRef.current) {
          agoraEngineRef.current = await RtcEngine.create(AGORA_APP_ID);
          console.log('Agora engine created');
          await agoraEngineRef.current.enableVideo();
          console.log('Video enabled');
          setIsAgoraInitialized(true);
        }
      } catch (err) {
        console.error('Error initializing Agora engine:', err);
      }
    };
  
    initAgoraEngine();
  
    return () => {
      if (agoraEngineRef.current) {
        agoraEngineRef.current.destroy();
      }
    };
  }, []);
  const handleEdit = (booking) => {
    setCurrentBooking(booking);
    setNewDate(new Date(booking.date));
    setNewTime(booking.time);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    if (currentBooking) {
      try {
        const response = await axios.put(`http://192.168.174.72:3000/slots/booking/${currentBooking._id}`, {
          ...currentBooking,
          date: newDate.toISOString().split('T')[0],
          time: newTime,
        });
        console.log('Booking updated:', response.data);
        setBookings((prevBookings) =>
          prevBookings.map((b) => (b._id === currentBooking._id ? response.data.booking : b))
        );
        setIsModalVisible(false);
      } catch (err) {
        console.error('Error updating booking:', err);
        Alert.alert('Error', 'Failed to update booking');
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (booking) => {
    Alert.alert(
      'Delete Booking',
      `Are you sure you want to delete booking for ${booking.propertyName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await axios.delete(`http://192.168.174.72:3000/slots/booking/${booking._id}`);
              console.log('Booking deleted:', response.data);
              setBookings((prevBookings) => prevBookings.filter((b) => b._id !== booking._id));
            } catch (err) {
              console.error('Error deleting booking:', err);
              Alert.alert('Error', 'Failed to delete booking');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleVideoCall = async (organisationName) => {
    try {
      console.log('Fetching organisation details...');
      const response = await axios.get(`http://192.168.174.72:3000/organisation/organisation/${organisationName}`);
      const rootUserName = response.data.RootUserName;
      console.log('Organisation details fetched', response.data);
  
      // Get the channel name and user token from your backend
      console.log('Fetching Agora token...');
      const channelResponse = await axios.post('http://192.168.174.72:3000/get-agora-token', {
        user: rootUserName,
      });
      const { channel, token } = channelResponse.data;
      console.log('Agora token fetched', channelResponse.data);
  
      setChannelName(channel);
      setUserToken(token);
      setIsVideoCallVisible(true);
  
      const engine = agoraEngineRef.current;
      console.log('Checking Agora engine:', engine);
  
      if (engine) {
        if (!engine.isInitialized) {
          console.log('Initializing Agora engine...');
          await engine.enableVideo();
          console.log('Video enabled');
          engine.isInitialized = true;
        }
  
        console.log('Joining channel...');
        await engine.joinChannel(token, channel, null, 0).catch((err) => {
          console.error('Error joining Agora channel:', err);
          Alert.alert('Error', 'Failed to join the video call');
        });
        console.log('Channel joined');
      } else {
        console.error('Agora engine is not initialized');
        Alert.alert('Error', 'Agora engine is not initialized');
      }
    } catch (err) {
      console.error('Error fetching organisation details:', err);
      Alert.alert('Error', 'Failed to fetch organisation details');
    }
  };
  const handleEndCall = async () => {
    const engine = agoraEngineRef.current;
    if (engine) {
      await engine.leaveChannel();
    }
    setIsVideoCallVisible(false);
  };
  if (loading) return <ActivityIndicator size="large" color="#FF5733" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.username}>Welcome: {username}</Text>

      <Text style={styles.sectionTitle}>Booking History:</Text>
      {bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <View key={index} style={styles.booking}>
            <Text style={styles.bookingText}>Property: {booking.propertyName}</Text>
            <Text style={styles.bookingText}>Date: {new Date(booking.date).toDateString()}</Text>
            <Text style={styles.bookingText}>Time: {booking.time}</Text>
            <Text style={styles.bookingText}>Status: {booking.status}</Text>
            {booking.status === 'confirmed' && (
              <Text style={styles.bookingText}>Room ID: {booking.RoomId}</Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleEdit(booking)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(booking)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.videoCallButton]} onPress={() => handleVideoCall(booking.organisationName)}>
                <Text style={styles.buttonText}>Video Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noBookings}>No bookings found</Text>
      )}

      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Booking</Text>
          <DatePicker
            date={newDate || new Date()}
            onDateChange={setNewDate}
          />
          <Picker
            selectedValue={newTime}
            onValueChange={(itemValue) => setNewTime(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Time" value="" />
            {[...Array(24).keys()].map((hour) => (
              <Picker.Item key={hour} label={`${hour}:00`} value={`${hour}:00`} />
            ))}
          </Picker>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          {bookingMessage ? <Text style={styles.bookingMessage}>{bookingMessage}</Text> : null}
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF5733',
    marginBottom: 15,
  },
  booking: {
    padding: 20,
    marginBottom: 15,
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
    shadowRadius: 4.65,
    elevation: 8,
  },
  bookingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  noBookings: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 50,
    color: '#FF5733',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff3333',
  },
  videoCallButton: {
    backgroundColor: '#33cc33',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#aaa',
  },
  picker: {
    width: '100%',
    marginBottom: 20,
  },
  bookingMessage: {
    color: 'green',
    marginTop: 15,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProfilePage;
