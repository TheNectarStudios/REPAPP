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
