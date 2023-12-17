import * as ImagePicker from "expo-image-picker";
import { storage } from "./firebase";
import * as Crypto from "expo-crypto";
import { Image } from "react-native-compressor";

export const addImageFromCameraRoll = async (
  multiple,
  folder,
  progressCallback,
  completedCallback,
) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    allowsMultipleSelection: multiple,
  });

  if (!result.canceled) {
    try {
      const promises = result.assets.map((item) =>
        processItemAsync(folder, item, progressCallback),
      );
      const processedResults = await Promise.all(promises);
      completedCallback(processedResults);
    } catch (error) {
      console.error("Error occurred during processing:", error);
    }
  }
};

export const addImageFromPhoto = async (
  photo,
  folder,
  progressCallback,
  completedCallback,
) => {
  try {
    const processedResults = await processItemAsync(
      folder,
      photo,
      progressCallback,
    );
    completedCallback(processedResults);
  } catch (error) {
    console.error("Error occurred during processing:", error);
  }
};

async function processItemAsync(folder: string, asset, progressCallback) {
  const result = await Image.compress(asset.uri, {
    progressDivider: 10,
    downloadProgress: (progress) => {
      console.log("downloadProgress: ", progress);
    },
  });

  return new Promise((resolve, reject) => {
    const promises = [];
    {
      try {
        const storageRef = getStorageRef(folder);
        const uploadTask = storageRef.putFile(result);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const uploadProgress = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
            progressCallback(uploadProgress);

            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.log("error file upload:", error);
          },
          () => {
            const p = storageRef.getDownloadURL().then((downloadURL) => {
              console.log("File available at", downloadURL);
              console.log("dimensions", asset.height, asset.width);
              const ratio = asset.height / asset.width;
              resolve(ratio + "*" + downloadURL);
            });
          },
        );
      } catch (error) {
        console.log("processItemAsync error:", error);
      }
    }
  });
}

function getStorageRef(folder: string) {
  const UUID = Crypto.randomUUID();
  const d = new Date();

  const fileName =
    folder +
    "/" +
    d.getUTCFullYear() +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "/" +
    UUID;

  // const storageRef = ref(storage, fileName);
  const storageRef = storage().ref(fileName);

  return storageRef;
}
