import fs from "fs";

function getInput() {
  return fs.readFileSync("input/data.txt", "utf8").split("\n");
}

function addExpandedEffect(
  noGalaxyRows: Array<number>,
  noGalaxyCols: Array<number>,
  point: [number, number],
  effect: number = 1
) {
  let [newRow, newCol] = point;

  newRow += noGalaxyRows.reduce(
    (acc, row) => (row < point[0] ? acc + effect - 1 : acc),
    0
  );

  newCol += noGalaxyCols.reduce(
    (acc, col) => (col < point[1] ? acc + effect - 1 : acc),
    0
  );

  return [newRow, newCol];
}

function solveFirst() {
  const galaxy = getInput();
  const galaxyTranspoce = galaxy[0]
    .split("")
    .map((_, colidx) => galaxy.map((row) => row[colidx]).join(""));

  // Expand the galaxy
  const noGalaxyRows = galaxy
    .map((row, i) => (!row.includes("#") ? i : -1))
    .filter((row) => row !== -1);

  const noGalaxyCols = galaxyTranspoce
    .map((row, i) => (!row.includes("#") ? i : -1))
    .filter((row) => row !== -1);

  // It's not necessary to expand the galaxy, just count double if we reach
  // the rows or cols inside noGalaxyRows or noGalaxyCols

  const asteriodsPositions = galaxy
    .map((row, rowidx) =>
      row
        .split("")
        .map((col, colidx) =>
          col === "#"
            ? addExpandedEffect(
                noGalaxyRows,
                noGalaxyCols,
                [rowidx, colidx],
                1000000 // ! 1 => first part | 1000000 => second part
              )
            : null
        )
        .filter((col) => col !== null)
    )
    .flat();

  const distances = asteriodsPositions.map((asteroid, i) => {
    const [row, col] = asteroid;
    return asteriodsPositions
      .slice(i + 1, asteriodsPositions.length)
      .map((otherAsteroid) => {
        const [otherRow, otherCol] = otherAsteroid;
        return Math.abs(row - otherRow) + Math.abs(col - otherCol);
      });
  });

  return distances.flat().reduce((acc, current) => acc + current, 0);
}

// ! The solution is the same as the first part
// ! The only change is the number passed to the addExpandedEffect function
// ! 1 => first part
// ! 1000000 => second part
// function solveSecond() {}

console.log(`First solution is: ${solveFirst()}`);
// console.log(`Second solution is: ${solveSecond()}`);
