import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import DatePicker from './DatePicker';
import { Picker } from '@react-native-picker/picker';
import RtcEngine from 'react-native-agora';
import axios from 'axios';

const AGORA_APP_ID = '159d9ac65d1949e4a159d0bb2351e9ef'; // Replace with your Agora App ID
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/100'; // Placeholder image URL

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState('');
  const [isVideoCallVisible, setIsVideoCallVisible] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [userToken, setUserToken] = useState('');
  const agoraEngineRef = useRef(null);
  const [imageLoading, setImageLoading] = useState(true);

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
    const fetchWatchlist = async () => {
      try {
        const storedWatchlist = await AsyncStorage.getItem('watchlist');
        if (storedWatchlist) {
          setWatchlist(JSON.parse(storedWatchlist));
        } else {
          setError('No watchlist found in storage');
        }
      } catch (err) {
        console.error('Error fetching watchlist from AsyncStorage:', err);
        setError('Failed to fetch watchlist from storage');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  useEffect(() => {
    const initAgoraEngine = async () => {
      try {
        console.log('Initializing Agora engine...');
        if (!agoraEngineRef.current) {
          agoraEngineRef.current = await RtcEngine.create(AGORA_APP_ID);
          console.log('Agora engine created');
          await agoraEngineRef.current.enableVideo();
          console.log('Video enabled');
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

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete ${item.propertyName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const updatedWatchlist = watchlist.filter((w) => w.id !== item.id);
              await AsyncStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
              setWatchlist(updatedWatchlist);
            } catch (err) {
              console.error('Error deleting item from watchlist:', err);
              Alert.alert('Error', 'Failed to delete item from watchlist');
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
      const response = await axios.get(`https://theserver-tp6r.onrender.com/organisation/organisation/${organisationName}`);
      const rootUserName = response.data.RootUserName;
      console.log('Organisation details fetched', response.data);

      // Get the channel name and user token from your backend
      console.log('Fetching Agora token...');
      const channelResponse = await axios.post('https://theserver-tp6r.onrender.com/get-agora-token', {
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

      <Text style={styles.sectionTitle}>Your Watchlist:</Text>
      {watchlist.length > 0 ? (
        watchlist.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>Property: {item.propertyName}</Text>
            <Text style={styles.itemText}>Date: {new Date(item.date).toDateString()}</Text>
            <Text style={styles.itemText}>Time: {item.time}</Text>
            <Text style={styles.itemText}>Status: {item.status}</Text>
            {item.status === 'confirmed' && (
              <Text style={styles.itemText}>Room ID: {item.RoomId}</Text>
            )}
            <View style={styles.imageContainer}>
              {item.imageURL ? (
                <>
                  <Image
                    source={{ uri: item.imageURL }}
                    style={styles.image}
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                    onError={() => setImageLoading(true)}
                  />
                  {imageLoading && <ActivityIndicator size="small" color="#FF5733" />}
                </>
              ) : (
                <>
                  <Image
                    source={{ uri: PLACEHOLDER_IMAGE }}
                    style={styles.image}
                  />
                  <ActivityIndicator size="small" color="#FF5733" />
                </>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(item)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.callButton]} onPress={() => handleVideoCall(item.propertyName)}>
                <Text style={styles.buttonText}>Video Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noItemsText}>No items in your watchlist</Text>
      )}

      <Modal isVisible={isVideoCallVisible} onBackdropPress={handleEndCall}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Video Call</Text>
          <Text style={styles.modalText}>Channel: {channelName}</Text>
          <View style={styles.videoCallContainer}>
            {/* Agora Video Call Component */}
          </View>
          <TouchableOpacity style={styles.modalButton} onPress={handleEndCall}>
            <Text style={styles.modalButtonText}>End Call</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5733',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  noItemsText: {
    fontSize: 16,
    color: '#999',
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF5733',
  },
  callButton: {
    backgroundColor: '#28A745',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5733',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  videoCallContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfilePage;
