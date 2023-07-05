export function parseLinks(text:string) {
  const urlRegex = /(https?:\/\/(?:www\.)?[^\s]+)/g;
  const matches = text.match(urlRegex);
  
  if (matches) {
    return matches;
  }
  
  return [];
}
