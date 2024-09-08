// src/screens/VideoCallScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';

const VideoCallScreen = ({ route }) => {
  const { roomName } = route.params || { roomName: 'DefaultRoom' };

  useEffect(() => {
    const userInfo = {
      displayName: 'User', // Optional: Replace with user's name
      email: 'user@example.com', // Optional: Replace with user's email
      avatar: 'https://example.com/avatar.png' // Optional: Replace with user's avatar URL
    };
    setTimeout(() => {
      JitsiMeet.call(`https://meet.jit.si/${roomName}`, userInfo);
    }, 1000);

    return () => {
      JitsiMeet.endCall();
    };
  }, [roomName]);

  return (
    <View style={styles.container}>
      <JitsiMeetView style={styles.jitsiMeetView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  jitsiMeetView: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

export default VideoCallScreen;
