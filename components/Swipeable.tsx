import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

type SwipeableProps = {
  id: string;
  onDelete?: () => void;
  children: React.ReactNode;
};

const Swipeable: React.FC<SwipeableProps> = ({ id, onDelete, children }) => {
  const translateX = useSharedValue(0);
  const rowHeight = useSharedValue(100);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.max(
        -SWIPE_THRESHOLD,
        Math.min(0, event.translationX),
      );
    })
    .onEnd(() => {
      if (translateX.value < -SWIPE_THRESHOLD / 2) {
        translateX.value = withSpring(-SWIPE_THRESHOLD); // Lock position
      } else {
        translateX.value = withSpring(0); // Reset position
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rowStyle = useAnimatedStyle(() => ({
    height: rowHeight.value,
    opacity: rowHeight.value,
  }));

  const handleDelete = () => {
    translateX.value = withTiming(-SCREEN_WIDTH, {}, async () => {
      if (onDelete) {
        rowHeight.value = withTiming(0);
        console.log("onDelete rowHeight.value", rowHeight.value, id);

        await runOnJS(onDelete)();
      }
    });
  };

  return (
    <Animated.View key={id} style={[styles.container, rowStyle]}>
      {/* Right Action (Delete) */}
      <View style={styles.rightAction}>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <AntDesign name="delete" size={25} color={"white"} />
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>

      {/* Swipeable Item */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.swipeable, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    overflow: "hidden",
  },
  swipeable: {
    backgroundColor: "white",
    padding: 20,
    width: SCREEN_WIDTH,
  },
  rightAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: SWIPE_THRESHOLD,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    alignContent: "center",
    alignItems: "center",
    padding: 10,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    paddingTop: 5,
  },
});

export default Swipeable;
