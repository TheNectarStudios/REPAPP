import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const JitsiMeeting = ({ meetingUrl }) => {
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: meetingUrl }} 
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    width: width,
    height: height,
  },
});

export default JitsiMeeting;
