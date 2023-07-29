import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import * as Crypto from "expo-crypto";

export const addImage = async (
  multiple,
  progressCallback,
  addImageCallback,
) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    allowsMultipleSelection: multiple,
  });

  if (!result.canceled) {
    processArrayAsync(result, progressCallback, addImageCallback);
  }
};

async function processArrayAsync(
  imageArray,
  progressCallback,
  addImageCallback,
) {
  try {
    const promises = imageArray.assets.map((item) =>
      processItemAsync(item, progressCallback),
    );
    const processedResults = await Promise.all(promises);

    console.log("Processed results:", processedResults);
    addImageCallback(processedResults);
    // Further processing with the processedResults, if needed.
  } catch (error) {
    console.error("Error occurred during processing:", error);
  }
}

async function processItemAsync(asset, progressCallback) {
  return new Promise((resolve, reject) => {
    const promises = [];
    {
      try {
        const convertedImage = new ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { height: 1000 } }],
          {
            compress: 0,
          },
        );

        fileToUpload = convertedImage.uri;

        const blob = getBlobAsync(asset.uri).then((blob) => {
          const storageRef = getStorageRef();
          const uploadTask = uploadBytesResumable(storageRef, blob);

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
              const p = getDownloadURL(uploadTask.snapshot.ref).then(
                (downloadURL) => {
                  console.log("File available at", downloadURL);

                  // return addImageCallback(downloadURL);
                  //return downloadURL;
                  resolve(downloadURL);
                },
              );
            },
          );
        });
      } catch (error) {
        console.error(`Error occurred while processing ${asset}:`, error);
        reject(error); // Return null or an error string, depending on your error handling needs.
      }
    }
  });
}

function getStorageRef() {
  const UUID = Crypto.randomUUID();
  const d = new Date();

  const fileName =
    "posts2/" +
    d.getUTCFullYear() +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "/" +
    UUID;

  const storageRef = ref(storage, fileName);
  return storageRef;
}
async function getBlobAsync(uri) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
}

function x() {
  const promises = result.assets.map(async (asset, index) => {
    console.log("result uri:", asset.uri);
    console.log("result height:", asset.height);
    console.log("result width:", asset.width);

    return Promise.all(promises);
  });
}
