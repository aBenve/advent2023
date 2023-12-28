import { readFileSync } from "fs";

function getInputLine() {
  return readFileSync("input/data.txt", "utf8").split("\n");
}

let ENGINE_ROW_COUNT = -1;
let ENGINE_COLUMN_COUNT = -1;

// function buildEngineMatrix(input: string[]) {
//   const matrix = [];
//   for (let i = 0; i < ENGINE_ROW_COUNT; i++) {
//     matrix.push(
//       line
//         .slice(i * ENGINE_COLUMN_COUNT, (i + 1) * ENGINE_COLUMN_COUNT)
//         .split("")
//     );
//   }
//   return matrix;
// }

function isSymbol(char: string) {
  return Number.isNaN(Number(char)) && char !== ".";
}

function hasASymbolOnTop(matrix: string[], row: number, column: number) {
  if (row === 0) {
    return false;
  }
  return isSymbol(matrix[row - 1][column]);
}

function hasASymbolOnLeft(matrix: string[], row: number, column: number) {
  if (column === 0) {
    return false;
  }
  return isSymbol(matrix[row][column - 1]);
}

function hasASymbolOnRight(matrix: string[], row: number, column: number) {
  if (column === ENGINE_COLUMN_COUNT - 1) {
    return false;
  }
  return isSymbol(matrix[row][column + 1]);
}

function hasASymbolOnBottom(matrix: string[], row: number, column: number) {
  if (row === ENGINE_ROW_COUNT - 1) {
    return false;
  }
  return isSymbol(matrix[row + 1][column]);
}

function hasASymbolOnTopLeftDiagonal(
  matrix: string[],
  row: number,
  column: number
) {
  if (row === 0 || column === 0) {
    return false;
  }
  return isSymbol(matrix[row - 1][column - 1]);
}

function hasASymbolOnTopRightDiagonal(
  matrix: string[],
  row: number,
  column: number
) {
  if (row === 0 || column === ENGINE_COLUMN_COUNT - 1) {
    return false;
  }
  return isSymbol(matrix[row - 1][column + 1]);
}

function hasASymbolOnBottomLeftDiagonal(
  matrix: string[],
  row: number,
  column: number
) {
  if (row === ENGINE_ROW_COUNT - 1 || column === 0) {
    return false;
  }
  return isSymbol(matrix[row + 1][column - 1]);
}

function hasASymbolOnBottomRightDiagonal(
  matrix: string[],
  row: number,
  column: number
) {
  if (row === ENGINE_ROW_COUNT - 1 || column === ENGINE_COLUMN_COUNT - 1) {
    return false;
  }
  return isSymbol(matrix[row + 1][column + 1]);
}

function checkSymbolForFirstNumber(
  matrix: string[],
  row: number,
  column: number
) {
  return (
    hasASymbolOnBottom(matrix, row, column) ||
    hasASymbolOnTopLeftDiagonal(matrix, row, column) ||
    hasASymbolOnBottomLeftDiagonal(matrix, row, column) ||
    hasASymbolOnLeft(matrix, row, column) ||
    hasASymbolOnTop(matrix, row, column)
  );
}

function checkSymbolForMiddleNumber(
  matrix: string[],
  row: number,
  column: number
) {
  return (
    hasASymbolOnBottom(matrix, row, column) ||
    hasASymbolOnTop(matrix, row, column)
  );
}

function checkSymbolForLastNumber(
  matrix: string[],
  row: number,
  column: number
) {
  return (
    hasASymbolOnBottom(matrix, row, column) ||
    hasASymbolOnTopRightDiagonal(matrix, row, column) ||
    hasASymbolOnBottomRightDiagonal(matrix, row, column) ||
    hasASymbolOnRight(matrix, row, column) ||
    hasASymbolOnTop(matrix, row, column)
  );
}

function isNumber(char: string) {
  return !Number.isNaN(Number(char));
}

function getUsefullNumbersFromRow(matrix: string[], row: number) {
  const useFullNumbers = [];

  let startNumberIdx = -1;
  let hasAdjacentSymbol = false;

  for (let column = 0; column < ENGINE_COLUMN_COUNT; column++) {
    if (isNumber(matrix[row][column])) {
      if (
        (column !== 0 && !isNumber(matrix[row][column - 1])) ||
        column === 0
      ) {
        startNumberIdx = column;
        hasAdjacentSymbol = checkSymbolForFirstNumber(matrix, row, column);
      }
      if (
        (column !== ENGINE_COLUMN_COUNT - 1 &&
          !isNumber(matrix[row][column + 1])) ||
        column === ENGINE_COLUMN_COUNT - 1
      ) {
        if (!hasAdjacentSymbol)
          hasAdjacentSymbol = checkSymbolForLastNumber(matrix, row, column);

        if (hasAdjacentSymbol) {
          useFullNumbers.push(
            Number(matrix[row].slice(startNumberIdx, column + 1))
          );
          hasAdjacentSymbol = false;
        }
      } else {
        if (!hasAdjacentSymbol)
          hasAdjacentSymbol = checkSymbolForMiddleNumber(matrix, row, column);
      }
    }
  }
  return useFullNumbers;
}

function solveFirst() {
  const useFullNumbers = [];

  const input = getInputLine();
  ENGINE_ROW_COUNT = input.length;
  ENGINE_COLUMN_COUNT = input[0].length;

  //   console.log(input);
  for (let row = 0; row < ENGINE_ROW_COUNT; row++) {
    const numbersToAdd = getUsefullNumbersFromRow(input, row);
    useFullNumbers.push(...numbersToAdd);
  }

  return useFullNumbers.reduce((acc, curr) => acc + curr, 0);
}

type Position = {
  row: number;
  column: number;
};

type NumberPosition = {
  position: Position;
  number: number;
  lenght: number;
};

function getAllAsterisks(input: string[]) {
  const allAsterisks: Position[] = [];

  for (let row = 0; row < ENGINE_ROW_COUNT; row++) {
    for (let column = 0; column < ENGINE_COLUMN_COUNT; column++) {
      if (input[row][column] === "*") {
        allAsterisks.push({ row, column });
      }
    }
  }

  return allAsterisks;
}

function getAllNumbers(input: string[]) {
  const allNumbers: NumberPosition[] = [];

  for (let row = 0; row < ENGINE_ROW_COUNT; row++) {
    let startNumberIdx = -1;

    for (let column = 0; column < ENGINE_COLUMN_COUNT; column++) {
      if (isNumber(input[row][column])) {
        if (
          (column !== 0 && !isNumber(input[row][column - 1])) ||
          column === 0
        ) {
          startNumberIdx = column;
        }
        if (
          (column !== ENGINE_COLUMN_COUNT - 1 &&
            !isNumber(input[row][column + 1])) ||
          column === ENGINE_COLUMN_COUNT - 1
        ) {
          const number = Number(input[row].slice(startNumberIdx, column + 1));
          const lenght = column - startNumberIdx + 1;
          allNumbers.push({
            position: { row, column: startNumberIdx },
            number,
            lenght,
          });
        }
      }
    }
  }

  return allNumbers;
}

function areAsteriskAndNumberAdjacent(
  asterisk: Position,
  number: NumberPosition
) {
  const { row: asteriskRow, column: asteriskColumn } = asterisk;
  const {
    position: { row: numberRow, column: numberColumn },
    lenght,
  } = number;

  if (
    asteriskColumn === numberColumn &&
    Math.abs(asteriskRow - numberRow) <= 1
  ) {
    return true;
  }

  for (let i = 0; i < lenght; i++) {
    if (
      Math.abs(asteriskRow - numberRow) <= 1 &&
      Math.abs(asteriskColumn - (numberColumn + i)) <= 1
    ) {
      return true;
    }
  }
}

function solveSecond() {
  const input = getInputLine();
  ENGINE_ROW_COUNT = input.length;
  ENGINE_COLUMN_COUNT = input[0].length;

  const allAsterisks: Position[] = getAllAsterisks(input);
  const allNumbers: NumberPosition[] = getAllNumbers(input);

  const useFullGears = [];

  for (let asterisk of allAsterisks) {
    let counter = 0;
    let adjacentNumbers = [];
    for (let number of allNumbers) {
      if (areAsteriskAndNumberAdjacent(asterisk, number)) {
        counter++;
        adjacentNumbers.push(number.number);
      }
    }
    if (counter === 2) {
      useFullGears.push(adjacentNumbers.reduce((acc, curr) => acc * curr, 1));
      adjacentNumbers = [];
    }
  }

  return useFullGears.reduce((acc, curr) => acc + curr, 0);
}

// console.log("First solution is:", solveFirst());
// console.log("Second solution is:", solveSecond());
