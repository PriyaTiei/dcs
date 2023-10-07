export const decodeHead50 = function (DataStr) {
  let result = [];
  result.push(DataStr.slice(1, 16));
  result.push(parseInt(DataStr.slice(16, 26)));
  for (let i = 26; i <= 631; i += 5) {
    if (i >= 251 && (i - 1) % 25 == 0) {
      if (parseInt(DataStr.slice(i, i + 5)) == 1) {
        result.push("NG");
      } else if (parseInt(DataStr.slice(i, i + 5)) == 2) {
        result.push("OK");
      } else {
        result.push("");
      }
    } else {
      result.push(parseInt(DataStr.slice(i, i + 5)));
    }
  }
  return result;
};
