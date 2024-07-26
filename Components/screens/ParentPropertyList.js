// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, Alert, Button, ScrollView } from 'react-native';
// import RNFS from 'react-native-fs';

// const ParentPropertyList = ({ navigateTo }) => {
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [parentPropertyName, setParentPropertyName] = useState('');
//   const [propertyData, setPropertyData] = useState([]);

//   useEffect(() => {
//     const fetchParentPropertyName = async () => {
//       const path = RNFS.DocumentDirectoryPath + '/selectedProperty.json';
//       try {
//         const fileExists = await RNFS.exists(path);
//         if (fileExists) {
//           const fileContents = await RNFS.readFile(path, 'utf8');
//           const { propertyName } = JSON.parse(fileContents);
//           setParentPropertyName(propertyName);
//         } else {
//           setMessage('Selected property file does not exist.');
//           setLoading(false);
//         }
//       } catch (e) {
//         setMessage('Failed to fetch property name from file: ' + e.message);
//         setLoading(false);
//       }
//     };

//     fetchParentPropertyName();
//   }, []);

//   useEffect(() => {
//     if (!parentPropertyName) {
//       return;
//     }

//     const fetchPropertyData = async () => {
//       try {
//         const response = await fetch(`http://192.168.11.144:3000/parentproperty/${parentPropertyName}/child-properties`);
//         if (response.status === 200) {
//           const data = await response.json();
//           setPropertyData(data);
//         } else {
//           const errorText = await response.text();
//           setMessage(`Error: ${errorText}`);
//         }
//       } catch (error) {
//         setMessage('Error fetching property data: ' + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPropertyData();
//   }, [parentPropertyName]);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#00ff00" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>ParentPropertyList</Text>
//       {message ? (
//         <Text style={styles.text}>{message}</Text>
//       ) : (
//         <ScrollView contentContainerStyle={styles.buttonContainer}>
//           {propertyData.map((property, index) => {
//             const title = typeof property === 'string' ? property : 'Unknown Property';
//             return (
//               <Button
//                 key={index}
//                 title={title}
//                 onPress={() => navigateTo('CreatorScreen', title)}
//               />
//             );
//           })}
//         </ScrollView>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     color: 'white',
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
// });

// export default ParentPropertyList;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button, ScrollView } from 'react-native';
import RNFS from 'react-native-fs';

const ParentPropertyList = ({ navigateTo }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [parentPropertyName, setParentPropertyName] = useState('');
  const [propertyData, setPropertyData] = useState([]);

  useEffect(() => {
    const fetchParentPropertyName = async () => {
      const path = RNFS.DocumentDirectoryPath + '/selectedProperty.json';
      try {
        const fileExists = await RNFS.exists(path);
        if (fileExists) {
          const fileContents = await RNFS.readFile(path, 'utf8');
          const { propertyName } = JSON.parse(fileContents);
          setParentPropertyName(propertyName);
        } else {
          setMessage('Selected property file does not exist.');
          setLoading(false);
        }
      } catch (e) {
        setMessage('Failed to fetch property name from file: ' + e.message);
        setLoading(false);
      }
    };

    fetchParentPropertyName();
  }, []);

  useEffect(() => {
    if (!parentPropertyName) {
      return;
    }

    const fetchPropertyData = async () => {
      try {
        const response = await fetch(`http://192.168.11.144:3000/parentproperty/${parentPropertyName}/child-properties`);
        if (response.status === 200) {
          const data = await response.json();
          setPropertyData(data);
        } else {
          const errorText = await response.text();
          setMessage(`Error: ${errorText}`);
        }
      } catch (error) {
        setMessage('Error fetching property data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [parentPropertyName]);

  const handleButtonPress = async (title) => {
    const path = RNFS.DocumentDirectoryPath + '/selectedChildProperty.json';
    try {
      await RNFS.writeFile(path, JSON.stringify({ propertyName: title }), 'utf8');
      navigateTo('CreatorScreen');
    } catch (e) {
      Alert.alert('Error', 'Failed to save property name: ' + e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>ParentPropertyList</Text>
      {message ? (
        <Text style={styles.text}>{message}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.buttonContainer}>
          {propertyData.map((property, index) => {
            const title = typeof property === 'string' ? property : 'Unknown Property';
            return (
              <Button
                key={index}
                title={title}
                onPress={() => handleButtonPress(title)}
              />
            );
          })}
        </ScrollView>
      )}
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
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default ParentPropertyList;
