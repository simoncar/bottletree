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
    let fileToUpload = "";

    const promises = result.assets.map(async (asset, index) => {
      console.log("result uri:", asset.uri);
      console.log("result height:", asset.height);
        console.log("result width:", asset.width);
        
      const convertedImage = await new ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { height: 1000 } }],
        {
          compress: 0,
        },
      );

      fileToUpload = convertedImage.uri;

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", fileToUpload, true);
        xhr.send(null);
      });

      const UUID = Crypto.randomUUID();
      const d = new Date();

      const fileName =
        "posts/" +
        d.getUTCFullYear() +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        "/" +
        UUID;

      const storageRef = ref(storage, fileName);

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
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);

            return addImageCallback(downloadURL);
          });
        },
      );
      return Promise.all(promises);
    });
  }
};
