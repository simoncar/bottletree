import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDecay,
} from "react-native-reanimated";
import { Image as ExpoImage } from "expo-image";

const AnimatedExpoImage = Animated.createAnimatedComponent(ExpoImage);

const PinchableImage = ({ source }: { source: string }) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
      translateX.value = withSpring(0, { damping: 10, stiffness: 100 });
      translateY.value = withSpring(0, { damping: 10, stiffness: 100 });
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [-(scale.value - 1) * 150, (scale.value - 1) * 150],
      });
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [-(scale.value - 1) * 150, (scale.value - 1) * 150],
      });
    });

  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={combinedGesture}>
        <AnimatedExpoImage
          source={{ uri: source }}
          style={[styles.image, animatedStyle]}
          resizeMode="contain"
        />
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  image: {
    height: Dimensions.get("window").height - 200,
    width: Dimensions.get("window").width,
  },
});

export default PinchableImage;
