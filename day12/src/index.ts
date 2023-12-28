import fs from "node:fs";

function getInput() {
  const input = fs.readFileSync("input/data.txt", "utf-8");
  return input.split("\n");
}

enum SpringsState {
  DAMAGE = "#",
  OPERATIONAL = ".",
  UNKNOWN = "?",
}

function isValidInfo(springs: string, correctInfo: number[]) {
  const springsInfo = springs
    .split(SpringsState.OPERATIONAL)
    .filter((item) => item.length !== 0);
  return (
    springsInfo.length === correctInfo.length &&
    springsInfo.every((item, index) => item.length === correctInfo[index])
  );
}

function getCombinationsAmount(springs: string, correctInfo: number[]) {
  if (!isValidInfo(springs, correctInfo)) {
    return 0;
  }

  const damageGroups = springs.split(SpringsState.OPERATIONAL);
  while (
    damageGroups.filter((group) => group.includes(SpringsState.DAMAGE))
      .length !== correctInfo.length &&
    damageGroups
      .map((group) => group.match(/#/g).length)
      .every((item, i) => item === correctInfo[i])
  ) {

  }

  for (let info of correctInfo) {
  }
}

function solveFirst() {
  const input = getInput();

  let totalPossibleCombinations = 0;

  for (let conditionRecord of input) {
    const [springs, correctData] = conditionRecord.split(" ");

    if (!springs.includes(SpringsState.UNKNOWN)) {
      continue;
    }

    const splitedByOperational = springs
      .split(SpringsState.OPERATIONAL)
      .filter((item) => item !== "");

    console.log(springs, splitedByOperational);
  }
}

// function solveSecond(){

// }

console.log(`First solution is ${solveFirst()}`);
// console.log(`Second solution is ${solveSecond()}`);
