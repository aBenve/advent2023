import fs from "node:fs";
import { head, zip } from "lodash";

function getInput() {
  return fs.readFileSync("./input/data.txt", "utf8").split("\n");
}

function solveFirts() {
  const input = getInput();

  const values = Array(input.length)
    .fill(0)
    .map((_, i) => {
      return [input[i].split(" ").map((v) => parseInt(v))];
    });

  let interpolation = [];
  for (let i = 0; i < values.length; i++) {
    let j = 0;

    while (!values[i][values[i].length - 1].every((v) => v === 0)) {
      const valuesToInterpolate = values[i][j];

      for (let k = 0; k < valuesToInterpolate.length; k++) {
        if (k === valuesToInterpolate.length - 1) break;
        interpolation.push(valuesToInterpolate[k + 1] - valuesToInterpolate[k]);
      }

      values[i].push(interpolation);
      interpolation = [];
      j++;
    }
  }

  // sum last value from each array
  let sum = 0;
  for (let history of values) {
    sum += history.reduce((acc, curr, i, arr) => {
      return acc + curr[curr.length - 1];
    }, 0);
  }

  return sum;
}
function solveSecond() {
  const input = getInput();

  const values = Array(input.length)
    .fill(0)
    .map((_, i) => {
      return [input[i].split(" ").map((v) => parseInt(v))];
    });

  let interpolation = [];
  for (let i = 0; i < values.length; i++) {
    let j = 0;

    while (!values[i][values[i].length - 1].every((v) => v === 0)) {
      const valuesToInterpolate = values[i][j];

      for (let k = 0; k < valuesToInterpolate.length; k++) {
        if (k === valuesToInterpolate.length - 1) break;
        interpolation.push(valuesToInterpolate[k + 1] - valuesToInterpolate[k]);
      }

      values[i].push(interpolation);
      interpolation = [];
      j++;
    }
  }

  let sum = 0;
  for (let history of values) {
    sum += history.reverse().reduce((acc, curr) => {
      return -acc + curr[0];
    }, 0);
  }

  return sum;
}

// console.log(solveFirts());
// console.log(solveSecond());

declare global {
  interface Array<T> {
    head(): T | undefined;
    zip(...arr: Array<any>[]): Array<any>;
  }
}

Array.prototype.head = function () {
  return head(this);
};

Array.prototype.zip = function (...arr) {
  return zip(this, ...arr);
};

console.log([1, 2, 3].head());
console.log([1, 2, 3].zip([4, 5, 6], [7, 8, 9], ["a", "b", "b"]));

console.log("Funciona!");
