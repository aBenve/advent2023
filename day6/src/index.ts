import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input/data.txt", "utf8");
}

type Race = {
  distance: number;
  time: number;
};

function parseInput(input: string) {
  const data = input.split("\n").map((line) => {
    return line
      .split(":")[1]
      .trim()
      .split(" ")
      .filter((num) => num !== "")
      .map((num) => Number(num));
  });

  const races: Race[] = data.reduce((acc, curr, i, arr) => {
    if (i !== 0) {
      return acc;
    }
    for (let [i, elem] of curr.entries()) {
      acc.push({
        time: elem,
        distance: arr[1][i],
      });
    }
    return acc;
  }, [] as Race[]);

  return races;
}

function getAmountOfWinners(race: Race) {
  let maxReached = false;
  const winners = [];
  for (let holding = 0; holding < race.time && !maxReached; holding++) {
    const isWin = (race.time - holding) * holding > race.distance;
    if (isWin) winners.push(holding);

    if (winners.length > 0 && !isWin) {
      maxReached = true;
      break;
    }
  }

  return winners.length;
}

function solveFirst() {
  const input = getInput();
  const races = parseInput(input);

  const amountOfWinners = [];

  for (let race of races) {
    amountOfWinners.push(getAmountOfWinners(race));
  }

  return amountOfWinners.reduce((acc, curr) => acc * curr, 1);
}

function solveSecond() {
  const input = getInput();
  const races = parseInput(input);

  const race = races[0];

  return getAmountOfWinners(race);
}

// console.log("First: ", solveFirst());
console.log("Second: ", solveSecond());
