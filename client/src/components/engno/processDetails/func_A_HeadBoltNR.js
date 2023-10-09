export const decodeAssyHeadBoltNR = function (dataStr) {
  let result = [];
  for (let i = 75; i <= 129; i = i + 6) {
    result.push(parseFloat(dataStr?.slice(i, i + 6)));
  }
  return result;
};
