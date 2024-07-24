import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DatePicker = ({ dates, onAddDate, onConfirm }) => {
  const [isPickerVisible, setPickerVisibility] = useState(false);

  const handleConfirm = (date) => {
    onAddDate(date);
    setPickerVisibility(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Select Date" onPress={() => setPickerVisibility(true)} />
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisibility(false)}
      />
      <ScrollView style={styles.dateList}>
        {dates.map((date, index) => (
          <Text key={index} style={styles.dateItem}>
            {date.toDateString()} {date.toTimeString().split(' ')[0]}
          </Text>
        ))}
      </ScrollView>
      <Button
        title="Confirm Dates"
        onPress={onConfirm}
        disabled={dates.length === 0}
        style={styles.confirmButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dateList: {
    marginTop: 10,
  },
  dateItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  confirmButton: {
    marginTop: 20,
  },
});

export default DatePicker;
