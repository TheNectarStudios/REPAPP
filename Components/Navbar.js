// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import HomeScreen from './screens/HomeScreen';
// import ProfileScreen from './screens/ProfileScreen';
// import CreatorScreen from './screens/CreatorScreen'; 
// import CreatorHomeScreen from './screens/CreatorHomeScreen';
// import NearbyScreen from './screens/NearbyScreen'; // Import the NearbyScreen component
// // import BookmarkScreen from './screens/BookmarkScreen'; // Import the BookmarkScreen component
// // import NotificationScreen from './screens/NotificationScreen'; // Import the NotificationScreen component
// // import MessageScreen from './screens/MessageScreen'; // Import the MessageScreen component
// // import SettingScreen from './screens/SettingScreen'; // Import the SettingScreen component
// // import HelpScreen from './screens/HelpScreen'; // Import the HelpScreen component
// // import LogoutScreen from './screens/LogoutScreen'; // Import the LogoutScreen component

// const Navbar = ({username , userRole}) => {
//   const [isSidebarVisible, setSidebarVisible] = useState(false);
//   const [currentScreen, setCurrentScreen] = useState('Home');

//   const toggleSidebar = () => {
//     setSidebarVisible(!isSidebarVisible);
//   };

//   const navigateTo = (screen) => {
//     setSidebarVisible(false);
//     setCurrentScreen(screen);
//   };

//   const renderScreen = () => {
//     switch(userRole) {
//       case "User" : 
//       switch (currentScreen) {
//         case 'Home':
//           return <HomeScreen />;
//           case 'Profile':
//             return <ProfileScreen />;
//             case 'Nearby':
//         return <NearbyScreen />;
//       // case 'Bookmark':
//       //   return <BookmarkScreen />;
//       // case 'Notification':
//       //   return <NotificationScreen />;
//       // case 'Message':
//       //   return <MessageScreen />;
//       // case 'Setting':
//       //   return <SettingScreen />;
//       // case 'Help':
//       //   return <HelpScreen />;
//       // case 'Logout':
//       //   return <LogoutScreen />;
//       default:
//         return <HomeScreen />;
//       }
//       case "Creator" :
//         return <CreatorScreen/>
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {isSidebarVisible && (
//         <View style={styles.sidebar}>
//           <Text>{userRole}</Text>
//           <Text style={styles.backbutton} onPress={toggleSidebar}>back ></Text>
//           <Text style={styles.sidebarItem} onPress={() => navigateTo('Home')}>Home</Text>
//           <Text style={styles.sidebarItem} onPress={() => navigateTo('Profile')}>Profile</Text>
//           <Text style={styles.sidebarItem} onPress={() => navigateTo('Nearby')}>Nearby</Text>
//           <Text style={styles.sidebarItem} onPress={() => navigateTo('Bookmark')}>Bookmark</Text>
//           <Text style={styles.sidebarItem} onPress={() => navigateTo('Notification')}>Notification</Text>
//           <Text style={styles.sidebarItem} onPress={() => navigateTo('Message')}>Message</Text>
//           <Text style={styles.sidebarItem} onPress={() => navigateTo('Setting')}>Setting</Text>
//           <Text style={styles.sidebarItem} onPress={() => navigateTo('Help')}>Help</Text>
//           <Text style={styles.sidebarItem} onPress={() => navigateTo('Logout')}>Logout</Text>
//         </View>
//       )}

//       <View style={styles.mainContent}>
//         <View style={styles.content}>
//           {renderScreen()}
//         </View>
//         <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
//           <Image source={require('../Assets/togglebar.png')} style={styles.toggleButtonImage} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: '#F5FCFF',
//   },
//   backbutton: {
//     color: '#fff',
//     fontSize: 20,
//     fontFamily: 'Roboto',
//   },
//   sidebar: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 250,
//     height: '100%',
//     backgroundColor: '#007AFF',
//     paddingVertical: 20,
//     paddingHorizontal: 10,
//     zIndex: 2,
//   },
//   sidebarItem: {
//     color: '#fff',
//     fontSize: 18,
//     paddingVertical: 15,
//   },
//   mainContent: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: '#F5FCFF',
//   },
//   toggleButton: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     borderRadius: 5,
//     zIndex: 3,
//   },
//   toggleButtonImage: {
//     width: 30,
//     height: 30,
//   },
//   content: {
//     flex: 1,
//     width: '100%',
//   },
// });
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback, BackHandler } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreatorScreen from './screens/CreatorScreen'; 
import CreatorHomeScreen from './screens/CreatorHomeScreen';
import NearbyScreen from './screens/NearbyScreen';
// import BookmarkScreen from './screens/BookmarkScreen'; // Import the BookmarkScreen component
// import NotificationScreen from './screens/NotificationScreen'; // Import the NotificationScreen component
// import MessageScreen from './screens/MessageScreen'; // Import the MessageScreen component
// import SettingScreen from './screens/SettingScreen'; // Import the SettingScreen component
// import HelpScreen from './screens/HelpScreen'; // Import the HelpScreen component
// import LogoutScreen from './screens/LogoutScreen'; // Import the LogoutScreen component

const Navbar = ({ username, userRole }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Home');

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

  const navigateTo = (screen) => {
    setSidebarVisible(false);
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
          // case 'Nearby':
          //   return <NearbyScreen />;
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
            return <CreatorHomeScreen onNavigate={() => navigateTo('Creator')} Username={username} />;
          case 'Creator':
            return <CreatorScreen onBack={() => navigateTo('CreatorHome')} />;
          default:
            return <CreatorHomeScreen onNavigate={() => navigateTo('Creator')} Username={username} />;
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
