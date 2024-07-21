import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Navbar from './Components/Navbar';
import RNFS from 'react-native-fs';

const App = () => {
  const [screen, setScreen] = useState('register'); // Possible values: 'register', 'login', 'verifyOTP', 'home'
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setOTP] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for token on initial load (simulating auto-login)
    const storedToken = ''; // Fetch token from wherever it's stored (e.g., AsyncStorage or elsewhere)
    if (storedToken) {
      setToken(storedToken);
      setScreen('home');
    }
  }, []);

  const handleRegister = async () => {
    try {
      console.log('Starting registration process...');
      const response = await fetch('http://192.168.0.102:3000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, phoneNumber, password, }),
      });
      setRole("User") ;
  
      console.log('Received response from server:', response.status);
  
      if (response.status === 200) {
        setScreen('verifyOTP'); // Move to OTP verification screen
        Alert.alert('Registration successful', 'Please verify your phone number using OTP sent to your phone number');
      } else {
        const errorText = await response.text();
        console.log('Registration failed with response:', response.status, errorText);
        Alert.alert('Registration failed', `Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Registration failed', 'An error occurred during registration');
    }
  };
  
  let [user123, serUser123] = ""; 
  const handleGettingRole = async ()=>{
    try {
      const response = await fetch('http://192.168.0.102:3000/user/getuser', {
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
      // console.error('Error:', error);
      Alert.alert('Fetch failed', 'An error occurred while fetching the user role');
    }
    
  }

  const saveUsername = async (username) => {
    const path = RNFS.DocumentDirectoryPath + '/user.json';
  
    try {
      const user = { username };
      await RNFS.writeFile(path, JSON.stringify(user), 'utf8');
      console.log('Username saved to file:', path);
    } catch (e) {
      console.error('Failed to save username to file:', e);
    }
  };
  
  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.102:3000/user/login', {
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

      setToken(data.token); 
      setScreen('home'); 

      Alert.alert('Login successful', 'Welcome!');
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login failed', 'An error occurred during login');
    }
    handleGettingRole(); 
  };
  const handleVerifyOTP = async () => {
    try {
      const response = await fetch('http://192.168.0.102:3000/user/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, verificationCode }),
      });
      console.log(verificationCode);

      if (response.status === 200) {
        Alert.alert('OTP verified', 'Phone number verified successfully');
        setScreen('home'); // Move to home screen after OTP verification
      } else {
        Alert.alert('OTP verification failed', 'Invalid OTP entered');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      Alert.alert('OTP verification failed', 'An error occurred during OTP verification');
    }
  };

  const handleLogout = () => {
    setToken(null); // Clear token from state
    setScreen('login'); // Move to login screen after logout
  };

  const renderScreen = () => {
    switch (screen) {
      case 'register':
        return (
          <View style={styles.container}>
            
            <Text style={styles.header}>Register</Text>
            {/* <TextInput
              style={styles.input}
              placeholder="Role"
              value={role}
              onChangeText={setRole}
            /> */}
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
            <Navbar  name={username} userRole= {role} />
            {/* <Text>{role}</Text> */}
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
