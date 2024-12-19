import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
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
  currentMonthYear?: { month: number; year: number }; // new prop
};

export const MonthYearScroller: React.FC<Props> = ({
  initialYear = new Date().getFullYear(),
  range = 5,
  onSelect,
  currentMonthYear, // new prop
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

  const items = [];
  for (const year of allYears) {
    for (let i = 0; i < MONTHS.length; i++) {
      items.push({ label: MONTHS[i], monthIndex: i, year });
    }
  }

  // Find the current index of the selected month/year
  const currentIndex = items.findIndex(
    (item) =>
      item.year === selectedYear && item.monthIndex === selectedMonthIndex,
  );

  // We'll store item width after layout to accurately scroll
  const [itemWidth, setItemWidth] = useState<number | null>(null);

  const handleSelect = (item: { year: number; monthIndex: number }) => {
    setSelectedMonthIndex(item.monthIndex);
    setSelectedYear(item.year);
    onSelect?.(item.monthIndex, item.year);
  };

  useEffect(() => {
    // Once we know the item width, scroll to currentIndex
    console.log("useEffect: ", currentIndex);

    if (itemWidth && currentIndex >= 0) {
      scrollRef.current?.scrollTo({
        x: currentIndex * (itemWidth + 20), // itemWidth + (2 * marginHorizontal=10)
        animated: false,
      });
    }
  }, [itemWidth, currentMonthYear]);

  useEffect(() => {
    if (currentMonthYear) {
      setSelectedMonthIndex(currentMonthYear.month);
      setSelectedYear(currentMonthYear.year);
    }
  }, [currentMonthYear]);

  const onItemLayout = (e: LayoutChangeEvent) => {
    if (!itemWidth) {
      const width = e.nativeEvent.layout.width;
      setItemWidth(width);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
      }}>
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
              key={`month-${idx}`}
              onPress={() => handleSelect(item)}
              onLayout={idx === 0 ? onItemLayout : undefined}
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
