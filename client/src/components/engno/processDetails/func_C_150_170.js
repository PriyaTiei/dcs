export function decode_C_150_170(dataStr) {
  const result = [];
  let dataList = dataStr?.split(",");
  result.push(dataList[0]?.slice(0, 16));
  result.push(
    dataList[0]?.slice(17, 20) === "150"
      ? "OP150"
      : dataList[0]?.slice(17, 20) === "170"
      ? "OP170"
      : ""
  );
  result.push(
    dataList[1] === "0011"
      ? "Model1"
      : dataList[1] === "0012"
      ? "Model2"
      : dataList[1] === "0013"
      ? "Model3"
      : ""
  );
  for (let i = 2; i < dataList.length; i++) {
    result.push(parseInt(dataList[i]));
  }
  return result;
}

// =IF(MID(B4,22,4)="0011","Model1",IF(MID(B4,22,4)="0012","Model2",IF(MID(B4,22,4)="0013","Model3"," ")))
