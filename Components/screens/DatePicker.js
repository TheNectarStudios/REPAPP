// components/DatePicker.js

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ date, onDateChange, onConfirm }) => {
  const [show, setShow] = React.useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select Date" onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
      <Text style={styles.selectedDate}>Selected Date: {date.toDateString()}</Text>
      {/* <Button
        title="Confirm Date"
        onPress={onConfirm}
        disabled={!date}
        style={styles.confirmButton}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  selectedDate: {
    marginTop: 10,
    fontSize: 16,
  },
  confirmButton: {
    marginTop: 20,
  },
});

export default DatePicker;
