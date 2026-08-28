export const decodeHead310 = function (dataStr) {
  if (!dataStr) return null;
  const list = dataStr.split(',');
  if (list.length < 28) return null;

  const rawJudgement = list[0]?.slice(16, 17);
  const parsedNumbers = list.map((item) => parseFloat(item));

  const formatJudgement = (val) => {
    const s = String(val);
    if (s === '1') return 'LL NG';
    if (s === '2') return 'OK';
    if (s === '4') return 'UL NG';
    if (s === '9') return 'LL2 NG';
    if (s === 'D' || s === 'd') return 'ERR';
    return s || '-';
  };

  return {
    waterJacket: {
      judgement: formatJudgement(rawJudgement),
      leakValue: parsedNumbers[1],
      stdUpper: parsedNumbers[2],
      stdLower: parsedNumbers[3],
      correction: parsedNumbers[4],
      testPressure: parsedNumbers[5],
      kVeValue: parsedNumbers[6],
    },
    oilHole: {
      judgement: formatJudgement(parsedNumbers[7]),
      leakValue: parsedNumbers[8],
      stdUpper: parsedNumbers[9],
      stdLower: parsedNumbers[10],
      correction: parsedNumbers[11],
      testPressure: parsedNumbers[12],
      kVeValue: parsedNumbers[13],
    },
    camCase: {
      judgement: formatJudgement(parsedNumbers[14]),
      leakValue: parsedNumbers[15],
      stdUpper: parsedNumbers[16],
      stdLower: parsedNumbers[17],
      correction: parsedNumbers[18],
      testPressure: parsedNumbers[19],
      kVeValue: parsedNumbers[20],
    },
    egr: {
      judgement: formatJudgement(parsedNumbers[21]),
      leakValue: parsedNumbers[22],
      stdUpper: parsedNumbers[23],
      stdLower: parsedNumbers[24],
      correction: parsedNumbers[25],
      testPressure: parsedNumbers[26],
      kVeValue: parsedNumbers[27],
    },
  };
};

export default decodeHead310;
