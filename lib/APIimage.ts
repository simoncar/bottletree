import * as ImagePicker from "expo-image-picker";
import { firebase, uploadBytes } from "@/lib/firebase";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

// Types and interfaces
interface ImageAsset {
  uri: string;
  height: number;
  width: number;
}

interface ImageProcessOptions {
  compress: number;
  format: ImageManipulator.SaveFormat;
  base64: boolean;
}

interface ProgressCallback {
  (progress: number): void;
}

// Constants
const DEFAULT_COMPRESSION_RATIO = 0.2;
const IMAGE_FORMAT = ImageManipulator.SaveFormat.JPEG;
const IS_WEB_PLATFORM = Platform.OS === "web";

export const addImageFromCameraRoll = async (
  multiple: boolean,
  folder: string,
  project: string,
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
        processItemAsync(folder, project, item, progressCallback),
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
  project: string,
  progressCallback: (progress: any) => void,
  completedCallback: { (sourceDownloadURL: any): void; (arg0: unknown): void },
) => {
  try {
    const processedResults = await processItemAsync(
      folder,
      project,
      photo,
      progressCallback,
    );
    completedCallback(processedResults);
  } catch (error) {
    console.error("Error occurred during processing addImageFromPhoto:", error);
  }
};

async function processItemAsync(
  folder: string,
  project: string,
  asset: ImageAsset,
  progressCallback: ProgressCallback,
): Promise<string> {
  let imageUri = asset.uri;
  let compressedImage;

  try {
    console.log("processItemAsync: ", asset);
    console.log("processItemAsync: ", asset.uri);

    if (IS_WEB_PLATFORM) {
      // TODO: for some reason this is not working on web, results in a larger file size and PNG?
      compressedImage = asset;
    } else {
      const compressionOptions: ImageProcessOptions = {
        compress: DEFAULT_COMPRESSION_RATIO,
        format: IMAGE_FORMAT,
        base64: true,
      };

      compressedImage = await ImageManipulator.manipulateAsync(
        asset.uri,
        [], // No operations, just compression
        compressionOptions,
      );
      imageUri = compressedImage.uri;
    }
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }

  const getBlobFromUri = async (uri: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = (e) =>
        reject(new TypeError(`Network request failed: ${e}`));
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  return new Promise((resolve, reject) => {
    try {
      const storageRef = getStorageRef(folder, project);

      if (IS_WEB_PLATFORM) {
        getBlobFromUri(imageUri).then((blob) => {
          firebase
            .storage()
            .ref(storageRef.fullPath)
            .put(blob)
            .then(() => {
              storageRef.getDownloadURL().then((downloadURL) => {
                console.log("File available at", downloadURL);
                console.log("dimensions", asset.height, asset.width);
                const ratio = asset.height / asset.width;
                resolve(ratio + "*" + downloadURL);
              });
            });
        });
      } else {
        const uploadTask = storageRef.putFile(imageUri);

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
            storageRef.getDownloadURL().then((downloadURL) => {
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

function getStorageRef(folder: string, project: string) {
  const UUID = Crypto.randomUUID();
  const d = new Date();

  const fileName = folder + "/" + project + "/images/" + UUID;

  //const storageRef = ref(storage, fileName);
  const storageRef = firebase.storage().ref(fileName);
  console.log("storageRef", storageRef);

  return storageRef;
}
