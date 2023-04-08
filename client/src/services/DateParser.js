export function dateFormat(unformatedDate, unformatedTime) {
  const date = new Date(unformatedDate);
  console.log(date);
  console.log(date.toISOString());
  return date.toISOString().substring(0, 10);
}
