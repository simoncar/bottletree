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
