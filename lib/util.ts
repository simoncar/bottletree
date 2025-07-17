import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

export function parseLinks(text: string) {
  const urlRegex = /(https?:\/\/(?:www\.)?[^\s]+)/g;
  const matches = text.match(urlRegex);

  if (matches) {
    return matches;
  }

  return [];
}

export function removeFirebaseWord(errorString) {
  const wordToRemove = "firebase:";

  return errorString
    .split(" ")
    .filter((word) => word.toLowerCase() !== wordToRemove)
    .join(" ");
}

export function getRelativeTime(timestamp: number) {
  if (timestamp) {
    dayjs.extend(relativeTime);
    return dayjs(timestamp).fromNow();
  } else {
    return "";
  }
}

export function parseImages(images: string[]) {
  const parsedImages: { ratio: number; url: string }[] = [];

  if (images === undefined || images.length === 0) {
    return [];
  }

  //firstly check if the images are already parsed
  if (
    images[0] &&
    typeof images[0] === "object" &&
    "ratio" in images[0] &&
    "url" in images[0]
  ) {
    return images; // Already parsed - this is the new format
  }

  //support for old format with asterisk before http
  images.forEach((image) => {
    if (containsAsteriskBeforeHttp(image)) {
      const parts = splitOnFirst(image, "*");
      parsedImages.push({ ratio: Number(parts[0]), url: parts[1] });
    } else {
      parsedImages.push({ ratio: 1, url: image });
    }
  });

  return parsedImages;
}

function containsAsteriskBeforeHttp(str) {
  const httpIndex = str.indexOf("http");
  if (httpIndex === -1) {
    return false; // "http" not found in the string
  }

  const substringBeforeHttp = str.substring(0, httpIndex);
  return substringBeforeHttp.includes("*");
}

function splitOnFirst(str, character) {
  const index = str.indexOf(character);

  if (index === -1) {
    return [str]; // The character is not found, return the original string in an array
  }

  return [str.substring(0, index), str.substring(index + 1)];
}
