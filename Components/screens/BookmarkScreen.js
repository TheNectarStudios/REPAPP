import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BookmarkScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>BookmarkScreen
          </Text>
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
    },
  });

export default BookmarkScreen;
