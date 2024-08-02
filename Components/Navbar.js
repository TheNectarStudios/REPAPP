import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback, BackHandler, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreatorScreen from './screens/CreatorScreen';
import CreatorHomeScreen from './screens/CreatorHomeScreen';
import NearbyScreen from './screens/NearbyScreen';
import ParentPropertyList from './screens/ParentPropertyList';
import DescriptionScreen from './screens/DescriptionCreator';
import SlotsApproval from './screens/SlotsApproval';

// Import other screens as needed

const Navbar = ({ username, userRole }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [organizationName, setOrganizationName] = useState(null);

  useEffect(() => {
    const backAction = () => {
      if (isSidebarVisible) {
        setSidebarVisible(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isSidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const navigateTo = async (screen, params) => {
    setSidebarVisible(false);

    if (screen === 'CreatorScreen' || screen === 'Description') {
      setSelectedProperty(params?.propertyName || null);
    }
    if (screen === 'SlotsApproval') {
      setOrganizationName(params?.organizationName || null);
    }
    
    // Save propertyName and organizationName to files if needed
    if (screen === 'CreatorHome') {
      try {
        await Promise.all([
          RNFS.writeFile(RNFS.DocumentDirectoryPath + '/selectedProperty.json', JSON.stringify({ propertyName: selectedProperty }), 'utf8'),
          RNFS.writeFile(RNFS.DocumentDirectoryPath + '/selectedOrganization.json', JSON.stringify({ organizationName: organizationName }), 'utf8')
        ]);
      } catch (e) {
        console.error('Failed to save data:', e);
        //Alert.//Alert('Error', 'Failed to save data.');
      }
    }

    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (userRole) {
      case 'User':
        switch (currentScreen) {
          case 'Home':
            return <HomeScreen />;
          case 'Profile':
            return <ProfileScreen />;
          case 'Nearby':
            return <NearbyScreen />;
          // Uncomment and add other screens as needed
          // case 'Bookmark':
          //   return <BookmarkScreen />;
          // case 'Notification':
          //   return <NotificationScreen />;
          // case 'Message':
          //   return <MessageScreen />;
          // case 'Setting':
          //   return <SettingScreen />;
          // case 'Help':
          //   return <HelpScreen />;
          // case 'Logout':
          //   return <LogoutScreen />;
          default:
            return <HomeScreen />;
        }
      case 'Creator':
        switch (currentScreen) {
          case 'CreatorHome':
            return <CreatorHomeScreen onNavigate={navigateTo} />;
          case 'ParentPropertyList':
            return <ParentPropertyList navigateTo={navigateTo} />;
          case 'CreatorScreen':
            return <CreatorScreen propertyName={selectedProperty} navigateTo={navigateTo} />;
          case 'Description':
            return <DescriptionScreen propertyName={selectedProperty} />;
          case 'SlotsApproval':
            return <SlotsApproval organizationName={organizationName} />;
          default:
            return <CreatorHomeScreen onNavigate={navigateTo} />;
        }
      default:
        return <HomeScreen />;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => isSidebarVisible && setSidebarVisible(false)}>
      <View style={styles.container}>
        {isSidebarVisible && (
          <View style={styles.sidebar}>
            <Text style={styles.sidebarItem} onPress={() => navigateTo('Home')}>Home</Text>
            <Text style={styles.sidebarItem} onPress={() => navigateTo('Profile')}>Profile</Text>
            {/* <Text style={styles.sidebarItem} onPress={() => navigateTo('Nearby')}>Nearby</Text> */}
            {/* <Text style={styles.sidebarItem} onPress={() => navigateTo('Bookmark')}>Bookmark</Text>
            <Text style={styles.sidebarItem} onPress={() => navigateTo('Notification')}>Notification</Text>
            <Text style={styles.sidebarItem} onPress={() => navigateTo('Message')}>Message</Text>
            <Text style={styles.sidebarItem} onPress={() => navigateTo('Setting')}>Setting</Text>
            <Text style={styles.sidebarItem} onPress={() => navigateTo('Help')}>Help</Text>
            <Text style={styles.sidebarItem} onPress={() => navigateTo('Logout')}>Logout</Text> */}
          </View>
        )}

        <View style={styles.mainContent}>
          <View style={styles.content}>
            {renderScreen()}
          </View>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
            <Image source={require('../Assets/togglebar.png')} style={styles.toggleButtonImage} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
  },
  backButton: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Roboto',
    marginBottom: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  sidebarItem: {
    color: '#fff',
    fontSize: 18,
    paddingVertical: 15,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  toggleButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 5,
    zIndex: 3,
  },
  toggleButtonImage: {
    width: 30,
    height: 30,
  },
  content: {
    flex: 1,
    width: '100%',
  },
});

export default Navbar;
