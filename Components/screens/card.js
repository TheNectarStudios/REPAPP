// import React from 'react';
// import { View, Text, StyleSheet} from 'react-native';

// const Card = (props) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>{props}
//       </Text>


//     </View>
//   );
// };

// const styles = StyleSheet.create({
  
// });

// export default Card;


import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Card = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      {/* Render other item properties as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
});

export default Card;
