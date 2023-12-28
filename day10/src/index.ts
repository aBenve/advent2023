import { copyFileSync, readFileSync } from "fs";
import { List, add, includes, isEqual, min, zipWith } from "lodash";

function getInput() {
  return readFileSync("input/data.txt", "utf-8");
}

enum Pipes {
  Ground = ".",
  NorthSouth = "|",
  EastWest = "-",
  NorthEast = "L",
  NorthWest = "J",
  SouthWest = "7",
  SouthEast = "F",
  Start = "S",
}

enum BasicDirections {
  North = "N",
  South = "S",
  East = "E",
  West = "W",
}

const basicDirections = {
  [BasicDirections.North]: [0, -1],
  [BasicDirections.South]: [0, 1],
  [BasicDirections.East]: [1, 0],
  [BasicDirections.West]: [-1, 0],
};

const directions = {
  [Pipes.NorthSouth]: {
    to: basicDirections[BasicDirections.South],
    from: basicDirections[BasicDirections.North],
  },
  [Pipes.EastWest]: {
    to: basicDirections[BasicDirections.East],
    from: basicDirections[BasicDirections.West],
  },
  [Pipes.NorthEast]: {
    to: basicDirections[BasicDirections.East],
    from: basicDirections[BasicDirections.North],
  },
  [Pipes.NorthWest]: {
    to: basicDirections[BasicDirections.West],
    from: basicDirections[BasicDirections.North],
  },
  [Pipes.SouthEast]: {
    to: basicDirections[BasicDirections.East],
    from: basicDirections[BasicDirections.South],
  },
  [Pipes.SouthWest]: {
    to: basicDirections[BasicDirections.West],
    from: basicDirections[BasicDirections.South],
  },
};

function addArrays(a: Array<number>, b: Array<number>): Array<number> {
  return zipWith(a, b, add);
}

function solveFirst() {
  const input = getInput();
  const inputGrid = input.split("\n").map((row) => row.split(""));

  const start = inputGrid
    .flatMap((row, y) =>
      row.map((pipe, x) => (pipe === Pipes.Start ? [x, y] : []))
    )
    .filter((x) => x.length > 0)
    .flat();

  for (let startDirection of [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]) {
    console.log(startDirection);
    // Start sequence and stop when reach start again
    let steps = 0;
    let current = [start[0] + startDirection[0], start[1] + startDirection[1]];
    let visitPositions = [start];

    while (true) {
      const [x, y] = current;
      const pipe = inputGrid[y][x];

      if (pipe === Pipes.Ground) {
        console.log("Path is broken. Ground found");
        break;
      }

      if (pipe === Pipes.Start && steps > 0) {
        steps++;
        return steps / 2;
      }

      const nextDirections = directions[pipe];

      if (!nextDirections) {
        console.log(pipe);
        console.log("Path is broken. No direction found");
        break;
      }
      const { to, from } = nextDirections;

      let nextDirection;
      if (
        isEqual(
          addArrays(to, current),
          visitPositions[visitPositions.length - 1]
        ) &&
        !isEqual(
          addArrays(from, current),
          visitPositions[visitPositions.length - 1]
        )
      ) {
        nextDirection = from;
      } else if (
        isEqual(
          addArrays(from, current),
          visitPositions[visitPositions.length - 1]
        ) &&
        !isEqual(
          addArrays(to, current),
          visitPositions[visitPositions.length - 1]
        )
      ) {
        nextDirection = to;
      } else {
        console.log("Path is broken. Bad direction found");
        break;
      }

      visitPositions.push(current);
      current = addArrays(current, nextDirection);

      steps++;
    }
    console.log("RES", steps);
  }

  return -1;
}

function buildShape(shape: Array<Array<number>>) {
  const matrix = [];
  shape.forEach(([x, y]) => {
    if (!matrix[y]) {
      matrix[y] = [];
    }
    matrix[y][x] = 1;
  });

  // fill holes
  for (let i = 0; i < matrix.length; i++) {
    if (!matrix[i]) {
      matrix[i] = [];
    }
    for (let j = 0; j < matrix[i].length; j++) {
      if (!matrix[i][j]) {
        matrix[i][j] = 0;
      }
    }
  }

  return matrix;
}

function solveSecond() {
  const input = getInput();
  const inputGrid = input.split("\n").map((row) => row.split(""));

  const start = inputGrid
    .flatMap((row, y) =>
      row.map((pipe, x) => (pipe === Pipes.Start ? [x, y] : []))
    )
    .filter((x) => x.length > 0)
    .flat();

  let loopPositions = [];
  let found = false;

  for (let startDirection of [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]) {
    if (found) {
      break;
    }

    console.log(startDirection);
    let steps = 0;
    let current = [start[0] + startDirection[0], start[1] + startDirection[1]];
    let visitPositions = [start];

    while (true) {
      const [x, y] = current;
      const pipe = inputGrid[y][x];

      if (pipe === Pipes.Ground) {
        console.log("Path is broken. Ground found");
        break;
      }

      if (pipe === Pipes.Start && steps > 0) {
        steps++;
        found = true;
        loopPositions.push(...visitPositions);
        break;
      }

      const nextDirections = directions[pipe];

      if (!nextDirections) {
        console.log(pipe);
        console.log("Path is broken. No direction found");
        break;
      }
      const { to, from } = nextDirections;

      let nextDirection;
      if (
        isEqual(
          addArrays(to, current),
          visitPositions[visitPositions.length - 1]
        ) &&
        !isEqual(
          addArrays(from, current),
          visitPositions[visitPositions.length - 1]
        )
      ) {
        nextDirection = from;
      } else if (
        isEqual(
          addArrays(from, current),
          visitPositions[visitPositions.length - 1]
        ) &&
        !isEqual(
          addArrays(to, current),
          visitPositions[visitPositions.length - 1]
        )
      ) {
        nextDirection = to;
      } else {
        console.log("Path is broken. Bad direction found");
        break;
      }

      visitPositions.push(current);
      current = addArrays(current, nextDirection);

      steps++;
    }
  }

  let innerShapeGroundPipes = 0;

  const shape = inputGrid;

  const lookup = buildShape(loopPositions);

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (
        lookup[i] &&
        lookup[i][j] !== 1 &&
        isInsideShape(shape, lookup, [j, i])
      ) {
        innerShapeGroundPipes++;
      }
    }
  }

  return innerShapeGroundPipes;
}

function isInsideShape(
  shape: Array<Array<string>>,
  frontier: Array<Array<number>>,
  point: Array<number>
) {
  const [x, y] = point;
  let counter = 0;
  for (const [i, pipe] of shape[y].entries()) {
    if (!pipe) {
      continue;
    }
    // console.log(pipe, [i, y], point);

    if (
      (pipe === Pipes.NorthSouth ||
        pipe === Pipes.NorthEast ||
        pipe === Pipes.NorthWest) &&
      // frontier.some((arr) => isEqual(arr, [i, y]))
      frontier[y] &&
      frontier[y][i] === 1
    ) {
      if (i < x) {
        counter++;
      }
    }
  }

  return counter % 2 === 1;
}

// console.log(`First solution: ${solveFirst()}`);
console.log(`Second solution: ${solveSecond()}`);
