export const decodeBlock235 = function (B3) {
  var result = [];
  // let B3 =
  //   "361112230706957021219D23F080000000071C23F180000000028DAC3EF80000000082BE3F180000000028FD83EEF00000000632D3F18000000002D0BD3EC20000000069C73F1800000000229D73F3C00000000400C3F1800000000269143F080000000059DF3F1800000000 00000000000000000000000000000000244E63F5E000000006C313F1800000000";
  let D3 = B3.slice(0, 16);
  result.push(D3);
  var E3, G3, H3, I3, J3, K3, P3, L3, M3, N3, Q3;

  function vehicleTypeFn(c, d) {
    if (B3.slice(c, d) == "2") {
      return { model: "Module 2", lts: "1.5 Lts." };
    } else if (B3.slice(c, d) == "3") {
      return { model: "Module 3", lts: "2 Lts." };
    } else {
      return { model: "Element not found", lts: " " };
    }
  }
  E3 = vehicleTypeFn(16, 17);
  result.push(E3);

  if (B3.slice(17, 18) == "1") {
    G3 = "OK";
  } else if (B3.slice(17, 18) == "2") {
    G3 = "NG";
  } else {
    G3 = "element not found";
  }

  result.push(G3);
  // console.log("-----------")
  // console.log("JUDGEMENT")
  if (B3.slice(18, 19) == "1") {
  } else if (B3.slice(18, 19) == "2") {
  } else if (B3.slice(18, 19) == "4") {
  } else if (B3.slice(18, 19) == "9") {
  } else if (B3.slice(18, 19) == "C") {
  } else if (B3.slice(18, 19) == "D") {
  }

  H3 = B3.slice(23, 27) + B3.slice(19, 23);

  // =INT(HEX2DEC(LEFT(H3))/8)

  let sample = H3;
  const HEX2DEC = (sample) => parseInt(sample, 16);
  let PI3 = HEX2DEC(sample) / 8;
  I3 = parseInt(PI3);

  // =MOD(INT(HEX2DEC(LEFT(H3,3))/8),256)-127

  const sampleJ3 = H3.slice(0, 3); // Get the leftmost 3 characters
  const HEX2DECJ3 = parseInt(sampleJ3, 16); // Convert to decimal
  const PIJ3 = HEX2DECJ3 / 8; // Divide by 8
  const INTJ3 = Math.floor(PIJ3); // Take the integer part using Math.floor
  const MODJ3 = INTJ3 % 256; // Apply the modulus operation
  J3 = MODJ3 - 127; // Subtract 127
  // This should output -1 for the given H3 value
  // =MOD(HEX2DEC(RIGHT(H3,6)),2^23)

  K3 = parseInt(H3.slice(2, 8), 16) % Math.pow(2, 23);

  // =(K3+2^23)*2^(J3-23)*-1^I3

  L3 = (K3 + Math.pow(2, 23)) * Math.pow(2, J3 - 23) * Math.pow(-1, I3);

  M3 = K3 * Math.pow(2, -126 - 23) * Math.pow(-1, J3);

  // =IF(K3=0,IF(I3=1,"-∞","∞"),"NaN")

  if (K3 === 0) {
    if (I3 === 1) {
      N3 = "-∞";
    } else {
      N3 = "∞";
    }
  } else {
    N3 = "NaN";
  }

  //  =IF(J3=128,N3,IF(J3=-127,IF(AND(I3=1,M3=0),"-0",M3),L3))

  P3 = B3.slice(31, 35) + B3.slice(27, 30);

  const HEX2DECQ3 = parseInt(P3, 16) / 8;
  Q3 = parseInt(HEX2DECQ3);

  var firstNumber = 19;
  var j = 1;

  for (let i = 0; i < 264; i += 8) {
    // function for checking judgement
    function judgement(a, b) {
      let value0;
      let judg = B3.slice(a, b);
      if (judg === "1") {
        value0 = "LL_NG";
      } else if (judg === "2") {
        value0 = "OK";
      } else if (judg === "4") {
        value0 = "UL_NG";
      } else if (judg === "9") {
        value0 = "LL2_NG";
      } else if (judg === "C") {
        value0 = "UL2_NG";
      } else if (judg === "D") {
        value0 = "ERR";
      } else {
        value0 = "  ";
      }

      result.push(value0);
    }

    // judgement of first plug
    if (i === 0) {
      // =IF(MID(B3,19,1)="1","LL_NG",IF(MID(B3,19,1)="2","OK",IF(MID(B3,19,1)="4","UL_NG",IF(MID(B3,19,1)="9",
      // "LL2_NG",IF(MID(B3,19,1)="C","UL2_NG",IF(MID(B3,19,1)="D","ERR"," "))))))
      judgement(18, 19);
    }


    // let value1 = B3.slice(firstNumber+i+4, firstNumber+i+8) + B3.slice(firstNumber+i, firstNumber+i+4)
    let value1 =
      B3.slice(firstNumber + i + 4, firstNumber + i + 8) +
      B3.slice(firstNumber + i, firstNumber + i + 4);
    // INT(HEX2DEC(LEFT(H3))/8)
    let value2 = parseInt(parseInt(value1.slice(0, 1), 16) / 8);

    let value3 = (parseInt(parseInt(value1.slice(0, 3), 16) / 8) % 256) - 127;
    // =MOD(HEX2DEC(RIGHT(H3,6)),2^23)
    let value4 = parseInt(value1.slice(2, 8), 16) % Math.pow(2, 23);
    // =(K3+2^23)*2^(J3-23)*-1^I3
    let value5 =
      (value4 + Math.pow(2, 23)) *
      Math.pow(2, value3 - 23) *
      Math.pow(-1, value2);
    // =K3*2^(-126-23)*(-1^J3)
    let value6 = value4 * Math.pow(2, -126 - 23) * Math.pow(-1, value3);
    // =IF(K3=0,IF(I3=1,"-∞","∞"),"NaN")
    let value7;
    if (value4 == 0) {
      if (value2 == 1) {
        value7 = "-infi";
      } else {
        value7 = "infi";
      }
    } else {
      value7 = "NaN";
    }

    // =IF(J3=128,N3,IF(J3=-127,IF(AND(I3=1,M3=0),"-0",M3),L3))
    let value8;
    if (value3 == 128) {
      value8 = value7;
    } else if (value3 == -127) {
      if (value2 == 1 && value6 == 0) {
        value8 = "-0";
      } else {
        value8 = value6.toFixed(3);
      }
    } else {
      value8 = value5.toFixed(3);
    }

    result.push(value8);
   
    if (j % 4 == 0) {
      i = i + 1;
      judgement(firstNumber + i - 1 + 8, firstNumber + i + 8);
    }
    j = j + 1;
  }

  return result;
};
