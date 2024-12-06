import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type Props = {
  initialYear?: number;
  range?: number; // how many years before and after the initialYear to show
  onSelect?: (monthIndex: number, year: number) => void;
};

export const MonthYearScroller: React.FC<Props> = ({
  initialYear = new Date().getFullYear(),
  range = 5,
  onSelect,
}) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState(initialYear);

  const scrollRef = useRef<ScrollView>(null);

  const allYears = [];
  for (let y = initialYear - range; y <= initialYear + range; y++) {
    allYears.push(y);
  }

  // Flattened list of items like: [Dec 2025, Jan, Feb, ... Dec, 2026, Jan, Feb...]
  // But for simplicity, let's just display months for a single selected year and a year picker horizontally.
  // If you actually want a combined scroll, just put all in a single horizontal ScrollView.
  // Here we'll do a horizontal scroll containing [Dec (for prev year), {months for current year}, Jan (for next year)]

  // For a combined scroll, we can do something like this:
  // Create an array of { label: string, year: number, monthIndex: number } for multiple years
  const items = [];
  for (const year of allYears) {
    for (let i = 0; i < MONTHS.length; i++) {
      items.push({ label: MONTHS[i], monthIndex: i, year });
    }
  }

  const handleSelect = (item: { year: number; monthIndex: number }) => {
    setSelectedMonthIndex(item.monthIndex);
    setSelectedYear(item.year);
    onSelect?.(item.monthIndex, item.year);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {items.map((item, idx) => {
          const isSelected =
            item.monthIndex === selectedMonthIndex &&
            item.year === selectedYear;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => handleSelect(item)}
              style={[styles.itemContainer, isSelected && styles.selectedItem]}>
              <Text
                style={[styles.itemText, isSelected && styles.selectedText]}>
                {item.label}
              </Text>
              <Text
                style={[
                  styles.itemYearText,
                  isSelected && styles.selectedText,
                ]}>
                {item.year}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  selectedItem: {
    backgroundColor: "#8ab4f8",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemYearText: {
    fontSize: 12,
    color: "#666",
  },
  selectedText: {
    color: "#fff",
  },
});
