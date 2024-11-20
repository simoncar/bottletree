import * as ImagePicker from "expo-image-picker";
import { firebase, uploadBytes } from "./firebase";
import * as Crypto from "expo-crypto";
//import { Image } from "react-native-compressor";
import { Platform } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

export const addImageFromCameraRoll = async (
  multiple: boolean,
  folder: string,
  progressCallback: {
    (progress: any): void;
  },
  completedCallback: {
    (sourceDownloadURLarray: any): void;
    (arg0: unknown[]): void;
  },
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
  photo: any,
  folder: string,
  progressCallback: (progress: any) => void,
  completedCallback: { (sourceDownloadURL: any): void; (arg0: unknown): void },
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

async function processItemAsync(folder: string, asset: any, progressCallback) {
  const isWeb = Platform.OS === "web";
  let result = asset.uri;
  let resultCompressed;
  // const format = ImageManipulator.SaveFormat.JPEG;

  // const saveOptions: ImageManipulator.SaveOptions = {
  //   compress: 0.8,
  //   format: format,
  //   base64: true,
  // };

  try {
    if (isWeb) {
      console.log("AAA isWeb: asset.uri ", asset.uri);
      resultCompressed = asset;
    } else {
      resultCompressed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [], // No operations, just compression
        {
          compress: 0.2, // Adjust the quality (0.0 to 1.0)
          format: ImageManipulator.SaveFormat.JPEG, // or PNG
          base64: true,
        },
      );
      result = resultCompressed.uri; // Update the URI with the compressed image
    }
  } catch (error) {
    console.error("Error compressing image:", error);
  }

  const getBlobFroUri = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed: " + e));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    return blob;
  };

  return new Promise((resolve, reject) => {
    try {
      const storageRef = getStorageRef(folder);

      if (isWeb) {
        console.log("BBB isWeb: getBlobFroUri ", result);

        getBlobFroUri(result).then((blob) => {
          uploadBytes(storageRef, blob).then(() => {
            const p = storageRef.getDownloadURL().then((downloadURL) => {
              console.log("File available at", downloadURL);
              console.log("dimensions", asset.height, asset.width);
              const ratio = asset.height / asset.width;
              resolve(ratio + "*" + downloadURL);
            });
          });
        });
      } else {
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
                console.log(
                  "Upload is running:",
                  snapshot.bytesTransferred,
                  snapshot.totalBytes,
                );
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
      }
    } catch (error) {
      console.log("processItemAsync error:", error);
      reject(error);
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

  //const storageRef = ref(storage, fileName);
  const storageRef = firebase.storage().ref(fileName);
  console.log("storageRef", storageRef);

  return storageRef;
}
