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
  console.log("Error removeFirebaseWord: ", errorString);

  return errorString
    .split(" ")
    .filter((word) => word.toLowerCase() !== wordToRemove)
    .join(" ");
}
