export function truncate(text: string, maxLength: number) {
  if (typeof text !== "string" || maxLength <= 0)
    return { truncatedText: "", isTruncated: false };
  if (text.length > maxLength) {
    return {
      truncatedText: text.slice(0, maxLength) + "...",
      isTruncated: true,
    };
  }
  return { truncatedText: text, isTruncated: false };
}
