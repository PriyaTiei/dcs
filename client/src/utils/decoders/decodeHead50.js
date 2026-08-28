export const decodeHead50 = function (DataStr) {
  const result = [];
  result.push(DataStr?.slice(1, 16));
  result.push(parseInt(DataStr?.slice(16, 26), 10));
  for (let i = 26; i <= 631; i += 5) {
    if (i >= 251 && (i - 1) % 25 === 0) {
      if (parseInt(DataStr?.slice(i, i + 5), 10) === 1) {
        result.push('NG');
      } else if (parseInt(DataStr?.slice(i, i + 5), 10) === 2) {
        result.push('OK');
      } else {
        result.push('');
      }
    } else {
      result.push(parseInt(DataStr?.slice(i, i + 5), 10));
    }
  }
  return result;
};

export default decodeHead50;
