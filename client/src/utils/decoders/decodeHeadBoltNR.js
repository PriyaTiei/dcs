export const decodeAssyHeadBoltNR = function (dataStr) {
  const result = [];
  if (!dataStr) return result;
  for (let i = 75; i <= 129; i += 6) {
    result.push(parseFloat(dataStr.slice(i, i + 6)));
  }
  return result;
};

export default decodeAssyHeadBoltNR;
