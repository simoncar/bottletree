import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { Image as ExpoImage } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedExpoImage = Animated.createAnimatedComponent(ExpoImage);

const PinchableImage = ({ source }: { source: string }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);
  const savedPositionX = useSharedValue(0);
  const savedPositionY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = Math.max(1, savedScale.value * e.scale);
    });

  const panGesture = Gesture.Pan()

    .maxPointers(2)
    .onStart(() => {
      savedPositionX.value = positionX.value;
      savedPositionY.value = positionY.value;
    })
    .onUpdate((e) => {
      positionX.value = savedPositionX.value + e.translationX;
      positionY.value = savedPositionY.value + e.translationY;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(scale.value) },
      { translateX: withSpring(positionX.value) },
      { translateY: withSpring(positionY.value) },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle as any}>
        <AnimatedExpoImage
          source={source}
          style={[styles.image, animatedStyle]}
          resizeMode="contain"
          transition={1000}
          contentFit="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: "100%",
  },
});

export default PinchableImage;
