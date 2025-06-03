"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = 60;
const ITEMS_PER_SCREEN = Math.floor(width / ITEM_WIDTH);

interface CalendarDate {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  fullDate: Date;
}

interface HorizontalCalendarProps {
  onDateChange: (date: Date) => void;
  selectedDate?: Date;
  taskDates?: Date[];
}

const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({
  onDateChange,
  selectedDate = new Date(),
  taskDates = [],
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState(
    new Date().getMonth()
  );
  const [currentDisplayYear, setCurrentDisplayYear] = useState(
    new Date().getFullYear()
  );
  const [selectedDateState, setSelectedDateState] = useState(selectedDate);

  // Generate calendar dates (3 months: previous, current, next)
  const generateCalendarDates = (): CalendarDate[] => {
    const dates: CalendarDate[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Generate dates for 3 months (previous, current, next)
    for (let monthOffset = -1; monthOffset <= 1; monthOffset++) {
      const targetDate = new Date(currentYear, currentMonth + monthOffset, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const fullDate = new Date(year, month, day);
        dates.push({
          date: day,
          month,
          year,
          isCurrentMonth: month === currentMonth,
          isToday:
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear(),
          fullDate,
        });
      }
    }

    return dates;
  };

  const [calendarDates] = useState<CalendarDate[]>(generateCalendarDates());

  // Check if date has tasks
  const hasTask = (date: Date): boolean => {
    return taskDates.some(
      (taskDate) =>
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
    );
  };

  // Handle date selection
  const handleDatePress = (dateItem: CalendarDate) => {
    setSelectedDateState(dateItem.fullDate);
    onDateChange(dateItem.fullDate);
  };

  // Handle scroll to update month indicator
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollX / ITEM_WIDTH);

    if (currentIndex >= 0 && currentIndex < calendarDates.length) {
      const currentDate = calendarDates[currentIndex];

      // Update month indicator only when we're at the beginning or end of a month
      const isAtMonthBoundary =
        currentDate.date === 1 ||
        currentDate.date ===
          new Date(currentDate.year, currentDate.month + 1, 0).getDate();

      if (isAtMonthBoundary) {
        setCurrentDisplayMonth(currentDate.month);
        setCurrentDisplayYear(currentDate.year);
      }
    }
  };

  // Scroll to today on mount
  useEffect(() => {
    const todayIndex = calendarDates.findIndex((date) => date.isToday);
    if (todayIndex !== -1 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: todayIndex * ITEM_WIDTH - (width / 2 - ITEM_WIDTH / 2),
          animated: false,
        });
      }, 100);
    }
  }, []);

  const monthNames = [
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

  return (
    <View style={styles.container}>
      {/* Month/Year Indicator */}
      <View style={styles.monthIndicator}>
        <Text style={styles.monthText}>
          {monthNames[currentDisplayMonth]} {currentDisplayYear}
        </Text>
      </View>

      {/* Calendar ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
      >
        {calendarDates.map((dateItem, index) => {
          const isSelected =
            selectedDateState.getDate() === dateItem.date &&
            selectedDateState.getMonth() === dateItem.month &&
            selectedDateState.getFullYear() === dateItem.year;

          return (
            <TouchableOpacity
              key={`${dateItem.year}-${dateItem.month}-${dateItem.date}`}
              style={[
                styles.dateItem,
                isSelected && styles.selectedDateItem,
                dateItem.isToday && styles.todayDateItem,
                !dateItem.isCurrentMonth && styles.otherMonthDateItem,
              ]}
              onPress={() => handleDatePress(dateItem)}
            >
              <Text
                style={[
                  styles.dateText,
                  isSelected && styles.selectedDateText,
                  dateItem.isToday && styles.todayDateText,
                  !dateItem.isCurrentMonth && styles.otherMonthDateText,
                ]}
              >
                {dateItem.date}
              </Text>
              {hasTask(dateItem.fullDate) && (
                <View
                  style={[
                    styles.taskIndicator,
                    isSelected && styles.selectedTaskIndicator,
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthIndicator: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  dateItem: {
    width: ITEM_WIDTH - 10,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    position: "relative",
  },
  selectedDateItem: {
    backgroundColor: "#4361EE",
  },
  todayDateItem: {
    backgroundColor: "#FEF3C7",
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  otherMonthDateItem: {
    opacity: 0.3,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  selectedDateText: {
    color: "white",
    fontWeight: "600",
  },
  todayDateText: {
    color: "#92400E",
    fontWeight: "600",
  },
  otherMonthDateText: {
    color: "#9CA3AF",
  },
  taskIndicator: {
    position: "absolute",
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
  selectedTaskIndicator: {
    backgroundColor: "#FEE2E2",
  },
});

export default HorizontalCalendar;
