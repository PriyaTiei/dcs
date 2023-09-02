// const li = [
//   "3611122306296555",
//   "000002", //
//   "000008",
//   "000008",
//   "000008",
//   "000008",
//   "000008",
//   "000075000000", //crank j#1 bore innere dia  (Remove 6 digits from right side will give in micro)
//   "000079000000",//crank j#2 bore innere dia
//   "000075000000",//crank j#3 bore innere dia
//   "000076000000",//crank j#4 bore innere dia
//   "000080000000",//crank j#5 bore innere dia
// ];

// ******************************

const list1 = [
  ["a", 1],
  ["b", 2],
  ["c", 3],
];

const list2 = [
  ["a", "app"],
  ["b", "bal"],
  ["c", "cat"],
];

const resultList = [];

list1.forEach((a) => {
  let flag1 = false;
  list2.forEach((b) => {
    if (a[0] === b[0]) {
      console.log(b);
      let tempList = b.splice(1);

      resultList.push([...a, ...tempList]);
      flag1 = true;
    } else {
    }
  });

  if (flag1 == false) {
    resultList.push([...a, "not available"]);
  }
});

console.log(resultList);
