import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

interface MonthYearPickerProps {
  selectedMonth: number; // 0-based (January = 0)
  selectedYear: number;
  onValueChange: (month: number, year: number) => void;
  minYear?: number;
  maxYear?: number;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  selectedMonth,
  selectedYear,
  onValueChange,
  minYear = 2000,
  maxYear = new Date().getFullYear(),
}) => {
  const [isMonthModalVisible, setMonthModalVisible] = useState(false);
  const [isYearModalVisible, setYearModalVisible] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i,
  );

  const handleMonthSelect = (month: number) => {
    onValueChange(month, selectedYear);
    setMonthModalVisible(false);
  };

  const handleYearSelect = (year: number) => {
    onValueChange(selectedMonth, year);
    setYearModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Month Selector */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setMonthModalVisible(true)}>
        <Text style={styles.selectorText}>{months[selectedMonth]}</Text>
      </TouchableOpacity>
      <Modal visible={isMonthModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={months}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleMonthSelect(index)}>
                <Text style={styles.modalText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setMonthModalVisible(false)}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Year Selector */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setYearModalVisible(true)}>
        <Text style={styles.selectorText}>{selectedYear}</Text>
      </TouchableOpacity>
      <Modal visible={isYearModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={years}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleYearSelect(item)}>
                <Text style={styles.modalText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setYearModalVisible(false)}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  selector: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    alignItems: "center",
  },
  selectorText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalItem: {
    padding: 15,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
  },
  modalClose: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f00",
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default MonthYearPicker;
