import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import { Image as ExpoImage } from "expo-image";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
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
		scale.value = savedScale.value * e.scale;
	});

const panGesture = Gesture.Pan()
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
		{ translateX: positionX.value },
		{ translateY: positionY.value },
		{ scale: scale.value },
	],
}));

return (
	<GestureHandlerRootView style={styles.container}>
		<GestureDetector gesture={composed}>
			<AnimatedExpoImage
				source={source}
				style={[styles.image, animatedStyle]}
				contentFit="contain"
			/>
		</GestureDetector>
	</GestureHandlerRootView>
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
