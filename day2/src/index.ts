import fs from "fs";

console.log("Day2!");

function* getInputLine() {
  yield* fs.readFileSync("input/data.txt", "utf8").split("\n");
}

type Try = {
  red: number;
  blue: number;
  green: number;
};

type Game = {
  tries: Try[];
  id: number;
};

function parseLine(line: string): Game {
  const splitByColon = line.split(":");
  const id = parseInt(splitByColon[0].split(" ")[1]);

  const triesInfo = splitByColon[1].split(";");
  const tries: Try[] = triesInfo.map((tryInfo) => {
    const numberAndColors = tryInfo.split(",");
    const toRet = {};
    for (let numberAndColor of numberAndColors) {
      const [_, number, color] = numberAndColor.split(" ");
      toRet[color] = parseInt(number);
    }
    return toRet as Try;
  });

  return {
    id,
    tries,
  };
}

function evaluateGame(game: Game, desiredConfig: Try): boolean {
  return game.tries.every((tryInfo) => {
    return (
      (tryInfo.red ?? 0) <= desiredConfig.red &&
      (tryInfo.blue ?? 0) <= desiredConfig.blue &&
      (tryInfo.green ?? 0) <= desiredConfig.green
    );
  });
}

function solveFirst() {
  const desiredConfig: Try = {
    red: 12,
    blue: 14,
    green: 13,
  };

  let sumIds = 0;

  for (let line of getInputLine()) {
    const game = parseLine(line);
    const evaluation = evaluateGame(game, desiredConfig);
    if (evaluation) sumIds += game.id;
  }

  return sumIds;
}

function getMaxNumberOfCubesForTry(tries: Try[]): [number, number, number] {
  let maxRed = -Infinity;
  let maxBlue = -Infinity;
  let maxGreen = -Infinity;

  for (let tryInfo of tries) {
    maxRed = Math.max(maxRed, tryInfo.red ?? 0);
    maxBlue = Math.max(maxBlue, tryInfo.blue ?? 0);
    maxGreen = Math.max(maxGreen, tryInfo.green ?? 0);
  }

  return [maxRed, maxBlue, maxGreen];
}

function solveSecond() {
  let sumPowers = 0;

  for (let line of getInputLine()) {
    const game = parseLine(line);
    const [maxRed, maxBlue, maxGreen] = getMaxNumberOfCubesForTry(game.tries);
    const power = maxRed * maxBlue * maxGreen;
    sumPowers += power;
  }

  return sumPowers;
}

console.log(solveSecond());
