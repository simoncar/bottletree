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
  //   const scale = useSharedValue(1);
  //   const translateX = useSharedValue(0);
  //   const translateY = useSharedValue(0);

  //   const imageWidth = 300;
  //   const imageHeight = 300;

  //   const pinchGesture = Gesture.Pinch()
  //     .onUpdate((event) => {
  //       scale.value = event.scale;
  //     })
  //     .onEnd(() => {
  //       scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  //       translateX.value = withSpring(0, { damping: 10, stiffness: 100 });
  //       translateY.value = withSpring(0, { damping: 10, stiffness: 100 });
  //     });

  //   const panGesture = Gesture.Pan()
  //     .onUpdate((event) => {
  //       translateX.value = event.translationX;
  //       translateY.value = event.translationY;
  //     })
  //     .onEnd((event) => {
  //       const maxOffsetX = (scale.value - 1) * (imageWidth / 2);
  //       const maxOffsetY = (scale.value - 1) * (imageHeight / 2);

  //       translateX.value = withSpring(
  //         Math.min(maxOffsetX, Math.max(translateX.value, -maxOffsetX)),
  //         { damping: 10, stiffness: 150 },
  //       );
  //       translateY.value = withSpring(
  //         Math.min(maxOffsetY, Math.max(translateY.value, -maxOffsetY)),
  //         { damping: 10, stiffness: 150 },
  //       );
  //     });

  //   const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  //   const animatedStyle = useAnimatedStyle(() => {
  //     return {
  //       transform: [
  //         { scale: scale.value },
  //         { translateX: translateX.value },
  //         { translateY: translateY.value },
  //       ],
  //     };
  //   });

  const scale = useSharedValue(1);

  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    scale.value = event.nativeEvent.scale;
  };

  const onPinchEnd = () => {
    scale.value = withSpring(1); // Reset to original size
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <GestureHandlerRootView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <PinchGestureHandler onGestureEvent={onPinchEvent} onEnded={onPinchEnd}>
          <AnimatedExpoImage
            source={source}
            style={[styles.image, animatedStyle]}
            contentFit="contain"
          />
        </PinchGestureHandler>
      </GestureHandlerRootView>
    </View>
  );

  //   return (
  //     <View style={styles.container}>
  //       <GestureDetector gesture={combinedGesture}>
  //         <AnimatedExpoImage
  //           source={{ uri: source }}
  //           style={[styles.image, animatedStyle]}
  //           resizeMode="contain"
  //         />
  //       </GestureDetector>
  //     </View>
  //   );
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
