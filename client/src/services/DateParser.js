export function dateFormat(unformatedDate, unformatedTime) {
  const date = new Date(unformatedDate);
  return date.toISOString().substring(0, 10);
}
