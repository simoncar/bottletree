import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

interface ImageInfo {
  url: string;
  ratio: number;
}

interface PostImageProps {
  imageUrls: ImageInfo[];
}

const PostImage = ({ imageUrls }: PostImageProps) => {
  if (!imageUrls || imageUrls.length === 0) {
    return null;
  }

  return (
    <View style={{ paddingVertical: 5 }}>
      {imageUrls.map((im, index) => {
        const ratio = Number(im.ratio) || 1;
        const width = Dimensions.get("window").width - 60;
        const height = width * ratio;

        return (
          <View style={{ paddingVertical: 5 }} key={index}>
            <Pressable
              onPress={() => {
                router.navigate({
                  pathname: "/viewPost",
                  params: {
                    image: encodeURIComponent(im.url),
                    width: width,
                    height: height,
                  },
                });
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: height,
                }}
                source={im.url}
                contentFit="contain"
              />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

export const ImageGrid = ({ imageUrls }: PostImageProps) => {
  if (!imageUrls || imageUrls.length === 0) {
    return null;
  }

  const renderItem = ({ item: im }: { item: ImageInfo }) => {
    const containerWidth = Dimensions.get("window").width - 40;
    const imageSpacing = 4;
    const imageSize = (containerWidth - imageSpacing * 2) / 3;

    return (
      <Pressable
        style={{ padding: imageSpacing / 2 }}
        onPress={() => {
          const ratio = Number(im.ratio) || 1;
          const width = Dimensions.get("window").width - 60;
          const height = width * ratio;
          router.navigate({
            pathname: "/viewPost",
            params: {
              image: encodeURIComponent(im.url),
              width: width,
              height: height,
            },
          });
        }}
      >
        <Image
          style={{
            width: imageSize,
            height: imageSize,
            borderRadius: 8,
          }}
          source={im.url}
          contentFit="cover"
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.gridContainer}>
      <FlatList
        data={imageUrls}
        renderItem={renderItem}
        keyExtractor={(item) => item.url}
        numColumns={3}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    paddingVertical: 5,
  },
});

export default PostImage;
export { PostImage };
