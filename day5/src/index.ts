import { info } from "node:console";
import { readFileSync } from "node:fs";
import { getSystemErrorMap } from "node:util";

function getInput() {
  return readFileSync("input/data.txt", "utf8").split("\n\n");
}

enum Type {
  SEED = 0,
  SOIL,
  FERTILIZER,
  WATER,
  LIGHT,
  TEMPERATURE,
  HUMIDITY,
  LOCATION,
}

type SeedInfo = {
  id: number;
};

type OtherInfo = {
  source: number;
  destination: number;
  lenght: number;
};

type infoMap = {
  [key in Exclude<Type, Type.SEED>]: OtherInfo[];
} & {
  [Type.SEED]: SeedInfo[];
};

function parseLine(line: string) {
  const splitedByColon = line.split(":");

  const seeds = splitedByColon[0].includes("seeds");

  if (!seeds) {
    const maps = splitedByColon[1]
      .split("\n")
      .filter((value) => value !== "")
      .map((value) => {
        const numbers = value.split(" ").map((value) => parseInt(value));
        return {
          destination: numbers[0],
          source: numbers[1],
          lenght: numbers[2],
        } as OtherInfo;
      });

    return maps;
  }

  const numbers = splitedByColon[1]
    .trim()
    .split(" ")
    .map((value) => parseInt(value));

  return Array.from({ length: numbers.length }).map((_, index) => {
    return {
      id: numbers[index],
    } as SeedInfo;
  });
}

function isInRange(value: number, source: number, lenght: number) {
  return value >= source && value < source + lenght;
}

function getMappedInfo(value: number, info: OtherInfo) {
  if (info === undefined) {
    return undefined;
  }
  return info.destination + (value - info.source);
}

function fillInfoMap(infoMap: infoMap, input: string[]) {
  for (let i = 1; i < input.length; i++) {
    const parsed = parseLine(input[i]);
    infoMap[i] = parsed;
  }
}

function buildSeedsPath(infoMap: infoMap) {
  const paths: number[][] = [];
  for (const seed of infoMap[Type.SEED]) {
    const path = [seed.id];

    const firstStep = infoMap[Type.SOIL].find((soil) =>
      isInRange(seed.id, soil.source, soil.lenght)
    );

    path.push(
      getMappedInfo(path[path.length - 1], firstStep as OtherInfo) ?? seed.id
    );
    for (let i = Type.FERTILIZER; i <= Type.LOCATION; i++) {
      const info = infoMap[i].find((info: OtherInfo) =>
        isInRange(
          path[path.length - 1],
          (info as OtherInfo).source,
          (info as OtherInfo).lenght
        )
      );

      if (info === undefined) {
        path.push(path[path.length - 1]);
      } else {
        path.push(getMappedInfo(path[path.length - 1], info as OtherInfo));
      }
    }
    paths.push(path);
  }
  return paths;
}

function solveFirst() {
  const input = getInput();

  let infoMap: infoMap = {
    [Type.SEED]: parseLine(input[0]) as SeedInfo[],
    [Type.SOIL]: null,
    [Type.FERTILIZER]: null,
    [Type.WATER]: null,
    [Type.LIGHT]: null,
    [Type.TEMPERATURE]: null,
    [Type.HUMIDITY]: null,
    [Type.LOCATION]: null,
  };

  fillInfoMap(infoMap, input);

  const paths: number[][] = buildSeedsPath(infoMap);

  return paths
    .map((path) => path[path.length - 1])
    .reduce((min, curr) => {
      return Math.min(min, curr);
    }, Number.MAX_SAFE_INTEGER);
}

function* remap(seed: number, seedLenght: number, map: number[][]) {
  const newMap = [];

  for (const [destination, source, lenght] of map) {
    const end = source + lenght - 1;
    const mapRelation = destination - source;

    if (!(end < seed || source > seed + seedLenght - 1)) {
      newMap.push([
        Math.max(seed, source),
        Math.min(end, seed + seedLenght - 1),
        mapRelation,
      ]);
    }
  }

  for (let i = 0; i < newMap.length; i += 1) {
    const [low, high, diff] = newMap[i];
    yield [low + diff, high + diff];

    if (i < newMap.length - 1 && newMap[i + 1][0] - newMap[i][1] > 1) {
      yield [newMap[i][1] + 1, newMap[i + 1][0] - 1];
    }
  }

  if (newMap.length === 0) {
    yield [seed, seed + seedLenght - 1];
    return;
  }

  if (newMap[0][0] > seed) {
    yield [seed, newMap[0][0] - 1];
  }

  if (newMap[newMap.length - 1][1] < seed + seedLenght - 1) {
    yield [newMap[newMap.length - 1][1] + 1, seed + seedLenght - 1];
  }
}

function solveSecond() {
  const input = getInput();

  const raw_seeds = input[0].split(" ").filter((value) => !isNaN(+value));
  const seeds = [];

  for (let i = 0; i < raw_seeds.length; i += 2) {
    seeds.push({
      id: +raw_seeds[i],
      lenght: +raw_seeds[i + 1],
    });
  }

  const maps = [];

  for (let i = 1; i < input.length; i++) {
    const map = input[i]
      .split(":")[1]
      .split("\n")
      .filter((value) => value !== "")
      .map((value) => {
        const numbers = value.split(" ").map((value) => parseInt(value));
        // Destination, Source, Lenght
        return [numbers[0], numbers[1], numbers[2]];
      });
    maps.push(map.sort((a, b) => a[1] - b[1]));
  }

  // console.log(maps);

  let ans = Number.MAX_SAFE_INTEGER;

  for (let seed of seeds) {
    // console.log(`Seed [${seed.id} ${seed.id + seed.lenght}]`);
    let currentIntervals = [[seed.id, seed.id + seed.lenght - 1]];
    let newIntervals = [];

    for (let [i, specificMap] of maps.entries()) {
      for (const currentInterval of currentIntervals) {
        // console.log(`Current interval ${currentIntervals}`);
        const [low, high] = currentInterval;
        for (const newInterval of remap(low, high - low + 1, specificMap)) {
          newIntervals.push(newInterval);
        }
      }

      currentIntervals = newIntervals;
      newIntervals = [];
    }

    for (const currentInterval of currentIntervals) {
      const [low, high] = currentInterval;
      ans = Math.min(ans, low);
    }
  }

  return ans;
}

// console.log(`First solution is ${solveFirst()}`);
console.time("Second solution");
console.log(`Second solution is ${solveSecond()}`);
console.timeEnd("Second solution");
