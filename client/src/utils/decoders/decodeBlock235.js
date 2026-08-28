export const decodeBlock235 = function (B3) {
  const result = [];
  const D3 = B3?.slice(0, 16);
  result.push(D3);
  let E3, G3;

  function vehicleTypeFn(c, d) {
    if (B3?.slice(c, d) === '2') {
      return { model: 'Module 2', lts: '1.5 Lts.' };
    } else if (B3?.slice(c, d) === '3') {
      return { model: 'Module 3', lts: '2 Lts.' };
    } else {
      return { model: 'Element not found', lts: ' ' };
    }
  }
  E3 = vehicleTypeFn(16, 17);
  result.push(E3);

  if (B3?.slice(17, 18) === '1') {
    G3 = 'OK';
  } else if (B3?.slice(17, 18) === '2') {
    G3 = 'NG';
  } else {
    G3 = 'element not found';
  }
  result.push(G3);

  const firstNumber = 19;
  let j = 1;

  for (let i = 0; i < 264; i += 8) {
    function judgement(a, b) {
      let value0;
      const judg = B3?.slice(a, b);
      if (judg === '1') {
        value0 = 'LL_NG';
      } else if (judg === '2') {
        value0 = 'OK';
      } else if (judg === '4') {
        value0 = 'UL_NG';
      } else if (judg === '9') {
        value0 = 'LL2_NG';
      } else if (judg === 'C') {
        value0 = 'UL2_NG';
      } else if (judg === 'D') {
        value0 = 'ERR';
      } else {
        value0 = '  ';
      }
      result.push(value0);
    }

    if (i === 0) {
      judgement(18, 19);
    }

    const value1 =
      B3?.slice(firstNumber + i + 4, firstNumber + i + 8) +
      B3?.slice(firstNumber + i, firstNumber + i + 4);
    const value2 = parseInt(parseInt(value1?.slice(0, 1), 16) / 8);
    const value3 = (parseInt(parseInt(value1?.slice(0, 3), 16) / 8) % 256) - 127;
    const value4 = parseInt(value1?.slice(2, 8), 16) % Math.pow(2, 23);
    const value5 =
      (value4 + Math.pow(2, 23)) *
      Math.pow(2, value3 - 23) *
      Math.pow(-1, value2);
    const value6 = value4 * Math.pow(2, -126 - 23) * Math.pow(-1, value3);

    let value7;
    if (value4 === 0) {
      if (value2 === 1) {
        value7 = '-infi';
      } else {
        value7 = 'infi';
      }
    } else {
      value7 = 'NaN';
    }

    let value8;
    if (value3 === 128) {
      value8 = value7;
    } else if (value3 === -127) {
      if (value2 === 1 && value6 === 0) {
        value8 = '-0';
      } else {
        value8 = value6.toFixed(3);
      }
    } else {
      value8 = value5.toFixed(3);
    }

    result.push(value8);

    if (j % 4 === 0) {
      i = i + 1;
      judgement(firstNumber + i - 1 + 8, firstNumber + i + 8);
    }
    j = j + 1;
  }

  return result;
};

export default decodeBlock235;
