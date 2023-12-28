import fs from "fs";

function openInput() {
  return fs.readFileSync("./input/data.txt", "utf8");
}

const numbersByName = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function getLineWritenNumbers(line: string): [number, number] {
  let writtenNumbers = Object.keys(numbersByName);

  let numberIdxs = {};

  writtenNumbers.forEach((number) => {
    let idx = line.indexOf(number);
    if (idx === -1) return;
    numberIdxs[number] = [idx, line.lastIndexOf(number)];
  });

  let minIdx = Infinity;
  let minWrittenNumber = "";
  let maxIdx = -Infinity;
  let maxWrittenNumber = "";
  for (let key in numberIdxs) {
    if (numberIdxs[key][0] < minIdx) {
      minWrittenNumber = key;
      minIdx = numberIdxs[key][0];
    }
    if (numberIdxs[key][1] > maxIdx) {
      maxWrittenNumber = key;
      maxIdx = numberIdxs[key][1];
    }
  }

  const [minIdxNum, maxIdxNum] = getLineNumbersIdxs(line);

  let numbers: [number, number] = [-1, -1];

  if (minIdx !== Infinity && minIdx < minIdxNum)
    numbers[0] = numbersByName[minWrittenNumber];
  else numbers[0] = Number(line[minIdxNum]);
  if (maxIdx !== -Infinity && maxIdx > maxIdxNum)
    numbers[1] = numbersByName[maxWrittenNumber];
  else numbers[1] = Number(line[maxIdxNum]);

  return numbers;
}

function getLineNumbersIdxs(line: string): [number, number] {
  let idx: [number, number] = [-1, -1];

  for (let i = 0, j = line.length - 1; i < line.length && j >= 0; i++, j--) {
    if (idx[0] !== -1 && idx[1] !== -1) return idx;
    if (Number(line[i]) && idx[0] === -1) idx[0] = i;
    if (Number(line[j]) && idx[1] === -1) idx[1] = j;
  }

  return idx;
}

function getLineNumbers(line: string): [number, number] {
  let numbers: [number, number] = [0, 0];

  for (let i = 0, j = line.length - 1; i < line.length && j >= 0; i++, j--) {
    if (numbers[0] !== 0 && numbers[1] !== 0) return numbers;
    if (Number(line[i]) && numbers[0] === 0) numbers[0] = Number(line[i]);
    if (Number(line[j]) && numbers[1] === 0) numbers[1] = Number(line[j]);
  }

  return numbers;
}

function solveFirst() {
  return openInput()
    .split("\n")
    .map((line) => {
      const [min, max] = getLineNumbers(line);
      return min * 10 + max;
    })
    .reduce((acc, curr) => acc + curr, 0);
}
function solveSecond() {
  return openInput()
    .split("\n")
    .map((line) => {
      const [minWritten, maxWritten] = getLineWritenNumbers(line);
      return minWritten * 10 + maxWritten;
    })
    .reduce((acc, curr) => acc + curr, 0);
}

console.log(solveSecond());
