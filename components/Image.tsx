import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Pressable, View } from "react-native";

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

export default PostImage;
