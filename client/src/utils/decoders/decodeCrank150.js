export function decode_C_150_170(dataStr) {
  const result = [];
  if (!dataStr) return result;
  const dataList = dataStr.split(',');
  result.push(dataList[0]?.slice(0, 16));
  result.push(
    dataList[0]?.slice(17, 20) === '150'
      ? 'OP150'
      : dataList[0]?.slice(17, 20) === '170'
      ? 'OP170'
      : ''
  );
  result.push(
    dataList[1] === '0011'
      ? 'Model1'
      : dataList[1] === '0012'
      ? 'Model2'
      : dataList[1] === '0013'
      ? 'Model3'
      : ''
  );
  for (let i = 2; i < dataList.length; i++) {
    result.push(parseInt(dataList[i], 10));
  }
  return result;
}

export default decode_C_150_170;
