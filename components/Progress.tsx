import React from "react";
import { View, StyleSheet } from "react-native";
import * as NativeProgress from "react-native-progress";

type ProgressProps = {
  progress: number;
};

const Progress = (props: ProgressProps) => {
  const { progress } = props;

  if (progress && progress > 0) {
    return (
      <View style={styles.progressContainer}>
        <NativeProgress.Bar
          progress={progress / 100}
          borderWidth={0}
          indeterminate
          width={null}
        />
      </View>
    );
  } else {
    return <View style={styles.progressContainer}></View>;
  }
};

const styles = StyleSheet.create({
  progressContainer: {
    flex: 1,
    height: 6,
    padding: 0,
    width: "100%",
  },
});

export default Progress;
