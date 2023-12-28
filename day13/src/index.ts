import fs from "fs";
import { get } from "http";

function getInput(): string[] {
  return fs.readFileSync("input/data.txt").toString().split("\n\n");
}

function getCenteredIndexes(
  mirrorLength: number,
  reflectionCenter: number[]
): number[] {
  if (
    mirrorLength <= 2 &&
    (reflectionCenter[0] !== 0 || reflectionCenter[1] !== 1)
  ) {
    return [-1, -1];
  }

  const [centerLeft, centerRight] = reflectionCenter;
  const radio = Math.min(
    Math.abs(centerLeft),
    Math.abs(centerRight - mirrorLength)
  );

  return Array.from(
    { length: 2 * radio + 2 },
    (_, i) => i + centerLeft - radio
  );
}

function checkReflection(mirror: string[], reflectionCenter: number): boolean {
  let toRet = true;

  const indexes = getCenteredIndexes(mirror.length - 1, [
    reflectionCenter,
    reflectionCenter + 1,
  ]);

  for (let i = 0; i < indexes.length; i++) {
    if (mirror[indexes[i]] !== mirror[indexes[indexes.length - i - 1]]) {
      toRet = false;
      break;
    }
  }

  return toRet;
}

function checkAlmostReflection(mirror: string[], reflectionCenter: number) {
  const indexes = getCenteredIndexes(mirror.length - 1, [
    reflectionCenter,
    reflectionCenter + 1,
  ]);

  for (let i = 0; i < indexes.length; i++) {
    const diffIndex = indexOfUniqueDifference(
      mirror[indexes[i]],
      mirror[indexes[indexes.length - i - 1]]
    );
    if (diffIndex !== -1) {
      return true;
    }
  }

  return false;
}

function solveFirst() {
  const input = getInput();
  const mirrors = input.map((row) => row.split("\n"));

  const mirrorsTransponce = [];
  for (let mirror of mirrors) {
    mirrorsTransponce.push(
      mirror[0]
        .split("")
        .map((_, colIndex) => mirror.map((row) => row[colIndex]).join(""))
    );
  }

  const reflectionRows = [];
  for (let mirror of mirrors) {
    for (let i = 0; i < mirror.length - 1; i++) {
      if (mirror[i] === mirror[i + 1]) {
        if (checkReflection(mirror, i)) {
          reflectionRows.push(i + 1);
        }
      }
    }
  }
  const reflectionCols = [];

  for (let mirrorT of mirrorsTransponce) {
    for (let i = 0; i < mirrorT.length - 1; i++) {
      if (mirrorT[i] === mirrorT[i + 1]) {
        if (checkReflection(mirrorT, i)) {
          reflectionCols.push(i + 1);
        }
      }
    }
  }

  return (
    reflectionRows.reduce((acc, curr) => acc + curr, 0) * 100 +
    reflectionCols.reduce((acc, curr) => acc + curr, 0)
  );
}

function indexOfUniqueDifference(strA, strB): number {
  let counter = 0;
  let index = -1;
  for (let i = 0; i < strA.length; i++) {
    if (strA[i] !== strB[i]) {
      counter++;
      index = i;
    }
  }
  return counter === 1 ? index : -1;
}

function fixSmudges(mirror: string[], reflectionCenter: number) {
  const indexes = getCenteredIndexes(mirror.length - 1, [
    reflectionCenter,
    reflectionCenter + 1,
  ]);

  for (let i = 0; i < indexes.length; i++) {
    if (
      indexOfUniqueDifference(
        mirror[indexes[i]],
        mirror[indexes[indexes.length - i - 1]]
      ) !== -1
    ) {
      const temp = mirror[indexes[i]];
      mirror[indexes[i]] = mirror[indexes[indexes.length - i - 1]];
      if (checkReflection(mirror, reflectionCenter)) {
        return true;
      } else {
        mirror[indexes[i]] = temp;
      }
    }
  }

  return false;
}

function solveSecond() {
  const input = getInput();
  const mirrorsRaw = input.map((row) => row.split("\n"));

  const mirrorsSmudged = Array.from({ length: mirrorsRaw.length }).fill(false);
  const reflectionRows = [];
  const reflectionCols = [];

  mirrorsRaw.map((mirrorRaw, j) => {
    for (let i = 0; i < mirrorRaw.length - 1; i++) {
      if (
        mirrorRaw[i] === mirrorRaw[i + 1] ||
        indexOfUniqueDifference(mirrorRaw[i], mirrorRaw[i + 1]) !== -1
      ) {
        if (checkAlmostReflection(mirrorRaw, i)) {
          if (fixSmudges(mirrorRaw, i)) {
            reflectionRows.push(i + 1);
            mirrorsSmudged[j] = true;
            break;
          }
        }
      }
    }
  });

  const mirrorsTransponce = [];
  for (let mirror of mirrorsRaw) {
    mirrorsTransponce.push(
      mirror[0]
        .split("")
        .map((_, colIndex) => mirror.map((row) => row[colIndex]).join(""))
    );
  }

  mirrorsTransponce.map((mirrorRaw, j) => {
    for (let i = 0; i < mirrorRaw.length - 1; i++) {
      if (
        mirrorRaw[i] === mirrorRaw[i + 1] ||
        indexOfUniqueDifference(mirrorRaw[i], mirrorRaw[i + 1]) !== -1
      ) {
        if (checkAlmostReflection(mirrorRaw, i) && !mirrorsSmudged[j]) {
          if (fixSmudges(mirrorRaw, i)) {
            reflectionCols.push(i + 1);
            mirrorsSmudged[j] = true;
            break;
          }
        }
      }
    }
  });

  return (
    reflectionRows.reduce((acc, curr) => acc + curr, 0) * 100 +
    reflectionCols.reduce((acc, curr) => acc + curr, 0)
  );
}

// console.log(`First solution is ${solveFirst()}`);
console.log(`Second solution is ${solveSecond()}`);
