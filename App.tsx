import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Navbar from './Components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom Button Component
const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const App = () => {
  const [screen, setScreen] = useState('login'); // Possible values: 'register', 'login', 'verifyOTP', 'home'
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
      } else {
        const errorText = await response.text();
        console.log('Registration failed with response:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
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
      console.error('Error fetching user role:', error);
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
      handleGettingRole();
    } catch (error) {
      console.error('Error during login:', error);
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
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
        setScreen('home'); // Move to home screen after OTP verification
      } else {
        console.error('OTP verification failed');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
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
            <CustomButton title="Register" onPress={handleRegister} />
            <Text style={styles.toggleText} onPress={() => setScreen('login')}>
              Already have an account? Login
            </Text>
          </View>
        );
      case 'login':
        return (
          <View style={styles.container}>
            <Text style={styles.header}>Login {role}</Text>
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
            <CustomButton title="Login" onPress={handleLogin} />
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
            <CustomButton title="Verify OTP" onPress={handleVerifyOTP} />
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
    borderRadius: 10, // Increased border radius for input fields
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  toggleText: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 10, // Increased border radius for the buttons
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
