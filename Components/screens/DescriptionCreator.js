// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';

// const DescriptionCreator = ({ propertyName }) => {
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [propertyData, setPropertyData] = useState(null);

//   const fetchPropertyData = async () => {
//     try {
//       const response = await fetch(`http://192.168.134.91:3000/childproperty/child-property/${propertyName}`);
//       if (response.status === 200) {
//         const data = await response.json();
//         setPropertyData(data);
//       } else {
//         const errorText = await response.text();
//         setMessage(`Error: ${errorText}`);
//       }
//     } catch (error) {
//       setMessage('Error fetching property data: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (propertyName) {
//       fetchPropertyData();
//     } else {
//       setMessage('Property name is missing.');
//       setLoading(false);
//     }
//   }, [propertyName]);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity style={styles.headerIcon}><Text style={styles.headerIconText}>&#9776;</Text></TouchableOpacity>
//           <TouchableOpacity style={styles.headerIcon}><Text style={styles.headerIconText}>&#9993;</Text></TouchableOpacity>
//         </View>
//         <View style={styles.headerRight}>
//           <TouchableOpacity style={styles.headerIcon}><Text style={styles.headerIconText}>&#128274;</Text></TouchableOpacity>
//           <TouchableOpacity style={styles.headerIcon}><Text style={styles.headerIconText}>&#128269;</Text></TouchableOpacity>
//         </View>
//       </View>
//       {loading && <ActivityIndicator size="large" color="#000000" />}
//       {message ? <Text style={styles.text}>{message}</Text> : null}
//       {propertyData && (
//         <View>
//           <View style={styles.imageContainer}>
//             {/* Empty slot for image */}
//           </View>
//           <View style={styles.propertyDetails}>
//             <Text style={styles.propertyName}>{propertyData.ChildPropertyName}</Text>
//             <Text style={styles.propertyPrice}>{propertyData.Price}</Text>
//             <Text style={styles.propertyArea}>Area: {propertyData.Area}</Text>
//             <Text style={styles.propertyLocation}>Location: {propertyData.Location}</Text>
//             <Text style={styles.propertyBuilder}>Builder: {propertyData.BuilderName}</Text>
//             <View style={styles.propertyFeatures}>
//               <View style={styles.featureItem}>
//                 <Text style={styles.featureLabel}>Bath:</Text>
//                 <Text style={styles.featureValue}>{propertyData.Bath}</Text>
//               </View>
//               <View style={styles.featureItem}>
//                 <Text style={styles.featureLabel}>Bed:</Text>
//                 <Text style={styles.featureValue}>{propertyData.Bedroom}</Text>
//               </View>
//               <View style={styles.featureItem}>
//                 <Text style={styles.featureLabel}>Room:</Text>
//                 <Text style={styles.featureValue}>{propertyData.Room}</Text>
//               </View>
//             </View>
//             <Text style={styles.propertyDescription}>{propertyData.Discription}</Text>
//           </View>
//           <View style={styles.buttonsContainer}>
//             <TouchableOpacity style={styles.button} disabled={true}>
//               <Text style={styles.buttonText}>SELECT DATE</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} disabled={true}>
//               <Text style={styles.buttonText}>CONFIRM DATE</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} disabled={true}>
//               <Text style={styles.buttonText}>Back</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerIcon: {
//     padding: 10,
//     backgroundColor: '#eee',
//     borderRadius: 50,
//     marginRight: 10,
//   },
//   headerIconText: {
//     fontSize: 20,
//   },
//   text: {
//     color: '#000',
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   imageContainer: {
//     width: '100%',
//     height: 200,
//     marginBottom: 20,
//     backgroundColor: '#eee', // Placeholder background color
//     justifyContent: 'center', // Center the placeholder text vertically
//     alignItems: 'center', // Center the placeholder text horizontally
//   },
//   propertyDetails: {
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   propertyName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   propertyPrice: {
//     fontSize: 18,
//     marginBottom: 5,
//   },
//   propertyArea: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   propertyLocation: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   propertyBuilder: {
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   propertyFeatures: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 15,
//   },
//   featureItem: {
//     alignItems: 'center',
//   },
//   featureLabel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   featureValue: {
//     fontSize: 18,
//   },
//   propertyDescription: {
//     fontSize: 16,
//     lineHeight: 24,
//     marginBottom: 20,
//   },
//   buttonsContainer: {
//     alignItems: 'center',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 5,
//     width: '80%',
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 18,
//   },
// });

// export default DescriptionCreator;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import DatePicker from './DateTimePicker';  // Adjust the path as necessary

const DescriptionCreator = ({ propertyName, navigateBack }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [propertyData, setPropertyData] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  const fetchPropertyData = async () => {
    try {
      const response = await fetch(`http://192.168.134.91:3000/childproperty/child-property/${propertyName}`);
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

  const handleAddDate = (date) => {
    setSelectedDates([...selectedDates, date]);
  };

  const handleConfirm = () => {
    console.log('Dates confirmed:', selectedDates);
    // Add your logic to save the selected dates to the database
  };

  useEffect(() => {
    if (propertyName) {
      fetchPropertyData();
    } else {
      setMessage('Property name is missing.');
      setLoading(false);
    }
  }, [propertyName]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <View style={styles.propertyDetails}>
            <Text style={styles.propertyName}>{propertyData?.ChildPropertyName}</Text>
            <Text style={styles.propertyPrice}>{propertyData?.Price}</Text>
            <Text style={styles.propertyArea}>Area: {propertyData?.Area}</Text>
            <Text style={styles.propertyFeature}>Bath: {propertyData?.Bath}</Text>
            <Text style={styles.propertyFeature}>Bed: {propertyData?.Bedroom}</Text>
            <Text style={styles.propertyFeature}>Room: {propertyData?.Room}</Text>
            <Text style={styles.propertyDescription}>{propertyData?.Discription}</Text>
            <Text style={styles.propertyLocation}>Location: {propertyData?.Location}</Text>
          </View>
          <View style={styles.bookingContainer}>
            <DatePicker dates={selectedDates} onAddDate={handleAddDate} onConfirm={handleConfirm} />
          </View>
          <Button title="Back" onPress={navigateBack} />
        </>
      )}
      {message ? <Text>{message}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  propertyDetails: {
    marginBottom: 20,
  },
  propertyName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  propertyPrice: {
    fontSize: 18,
    marginBottom: 5,
  },
  propertyArea: {
    fontSize: 16,
    marginBottom: 5,
  },
  propertyFeature: {
    fontSize: 16,
    marginBottom: 5,
  },
  propertyDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 16,
    marginBottom: 5,
  },
  bookingContainer: {
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
});

export default DescriptionCreator;
