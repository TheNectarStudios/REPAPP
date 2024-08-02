import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Navbar from './Components/Navbar';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [screen, setScreen] = useState('register'); // Possible values: 'register', 'login', 'verifyOTP', 'home'
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setOTP] = useState('');

  const handleRegister = async () => {
    try {
      console.log('Starting registration process...');
      const response = await fetch('https://theserver-tp6r.onrender.com/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, phoneNumber, password }),
      });
      setRole('User');

      console.log('Received response from server:', response.status);

      if (response.status === 200) {
        setScreen('verifyOTP'); // Move to OTP verification screen
        // Alert.alert('Registration successful', 'Please verify your phone number using OTP sent to your phone number');
      } else {
        const errorText = await response.text();
        console.log('Registration failed with response:', response.status, errorText);
        // Alert.alert('Registration failed', `Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // Alert.alert('Registration failed', 'An error occurred during registration');
    }
  };

  const handleGettingRole = async () => {
    try {
      const response = await fetch('https://theserver-tp6r.onrender.com/user/getuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setRole(data.userRole);
    } catch (error) {
      // Alert.alert('Fetch failed', 'An error occurred while fetching the user role');
    }
  };

  const saveUsername = async (username) => {
    try {
      await AsyncStorage.setItem('username', username);
      console.log('Username saved to AsyncStorage');
    } catch (e) {
      console.error('Failed to save username to AsyncStorage:', e);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('https://theserver-tp6r.onrender.com/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Save token and username to AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('username', username);

      setScreen('home');
      //Alert.//Alert('Login successful', 'Welcome!');

      handleGettingRole();
    } catch (error) {
      console.error('Error during login:', error);
      //Alert.//Alert('Login failed', 'An error occurred during login');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch('https://theserver-tp6r.onrender.com/user/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, verificationCode }),
      });
      console.log(verificationCode);

      if (response.status === 200) {
        //Alert.//Alert('OTP verified', 'Phone number verified successfully');

        // Save phone number to AsyncStorage if needed
        await AsyncStorage.setItem('phoneNumber', phoneNumber);

        setScreen('home'); // Move to home screen after OTP verification
      } else {
        //Alert.//Alert('OTP verification failed', 'Invalid OTP entered');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      //Alert.//Alert('OTP verification failed', 'An error occurred during OTP verification');
    }
  };

  const handleLogout = () => {
    setScreen('login'); // Move to login screen after logout
  };

  const renderScreen = () => {
    switch (screen) {
      case 'register':
        return (
          <View style={styles.container}>
            <Text style={styles.header}>Register</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Register" onPress={handleRegister} />
            <Text style={styles.toggleText} onPress={() => setScreen('login')}>
              Already have an account? Login
            </Text>
          </View>
        );
      case 'login':
        return (
          <View style={styles.container}>
            <Text style={styles.header}>Login {role} </Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
            <Text style={styles.toggleText} onPress={() => setScreen('register')}>
              Don't have an account? Register
            </Text>
          </View>
        );
      case 'verifyOTP':
        return (
          <View style={styles.container}>
            <Text>{verificationCode}</Text>
            <Text style={styles.header}>Verify OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="OTP"
              value={verificationCode}
              onChangeText={setOTP}
              keyboardType="numeric"
            />
            <Button title="Verify OTP" onPress={handleVerifyOTP} />
          </View>
        );
      case 'home':
        return (
          <View style={styles.homeContainer}>
            <Navbar name={username} userRole={role} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  homeContainer: {
    flex: 1,
  },
  homeContent: {
    flex: 1,
    paddingTop: 50, // Adjust this value as needed to avoid overlap with the Navbar
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  toggleText: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});

export default App;


