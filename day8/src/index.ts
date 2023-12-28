import fs from "node:fs";
import { parse } from "node:path";

function getInput() {
  return fs
    .readFileSync("./input/data.txt", "utf8")
    .split("\n")
    .filter((line) => line !== "");
}

type NodeInfo = {
  name: string;
  right: string;
  left: string;
};

type NodeInfoMap = {
  [key: string]: NodeInfo;
};

function parseLine(line: string) {
  const splittedByEqual = line.split("=");
  const name = splittedByEqual[0].trim();

  const [left, right] = splittedByEqual[1].split(", ").map((side) => {
    return side.replace(/[\(\)]/g, "").trim();
  });

  return { name, left, right };
}

function parseInputRawNodes(input: string[]): NodeInfoMap {
  const nodesInfo = input.reduce((acc, line) => {
    const lineInfo = parseLine(line);
    acc[lineInfo.name] = lineInfo;
    return acc;
  }, {});

  return nodesInfo as NodeInfoMap;
}

const LIMIT = 10000000000;

function followInstructions(root, nodesInfo, instructions: string) {
  let currentNode = root;
  let steps = 0;
  for (let i = 0; i < LIMIT; i++) {
    for (let instruction of instructions) {
      if (instruction === "L") {
        currentNode = nodesInfo[currentNode.left];
      }
      if (instruction === "R") {
        currentNode = nodesInfo[currentNode.right];
      }
      steps++;
    }

    if (currentNode.name === "ZZZ") break;
  }
  return steps;
}

function getStepsToEnd(root, nodesInfo, instructions: string) {
  let currentNode = root;
  let steps = 0;
  for (let i = 0; i < LIMIT; i++) {
    for (let instruction of instructions) {
      if (instruction === "L") {
        currentNode = nodesInfo[currentNode.left];
      }
      if (instruction === "R") {
        currentNode = nodesInfo[currentNode.right];
      }
      steps++;
    }

    if (currentNode.name.endsWith("Z")) break;
  }
  return steps;
}

// this works, but it takes so long
function followInstructionsForAllRoots(
  roots: string[],
  nodesInfo: NodeInfoMap,
  instructions: string
) {
  const currentNodes = roots.map((root) => {
    return nodesInfo[root];
  });
  let steps = 0;
  let founded = false;
  for (let i = 0; i < LIMIT && !founded; i++) {
    for (let instruction of instructions) {
      if (instruction === "L") {
        currentNodes.forEach((node, index) => {
          currentNodes[index] = nodesInfo[node.left];
        });
      }
      if (instruction === "R") {
        currentNodes.forEach((node, index) => {
          currentNodes[index] = nodesInfo[node.right];
        });
      }
      steps++;
      if (currentNodes.every((nodes) => nodes.name.endsWith("Z"))) {
        // console.log(currentNodes.map((nodes) => nodes.name));
        founded = true;
        break;
      }
      // if (currentNodes.some((nodes) => nodes.name.endsWith("Z")))
      //   console.log(currentNodes.map((nodes) => nodes.name));
    }

    // console.log(currentNodes.map((nodes) => nodes.name));
  }
  return steps;
}

function solveFirst() {
  const input = getInput();

  const instructions = input[0];
  const rawNodes = input.splice(1);

  const nodesInfo = parseInputRawNodes(rawNodes);
  const root = nodesInfo["AAA" as keyof typeof nodesInfo];

  const result = followInstructions(root, nodesInfo, instructions);
  return result;
}

// function solveSecond() {
//   const input = getInput();

//   const instructions = input[0];
//   console.log(instructions.length);
//   const rawNodes = input.splice(1);

//   const nodesInfo = parseInputRawNodes(rawNodes);
//   const roots = Object.keys(nodesInfo).filter((key) => {
//     return key.endsWith("A");
//   });

//   const result = followInstructionsForAllRoots(roots, nodesInfo, instructions);
//   return result;
// }

function greatestCommonDivisor(a: number, b: number): number {
  if (b === 0) return a;
  return greatestCommonDivisor(b, a % b);
}

function leastCommonMultiple(a: number, b: number): number {
  return (a * b) / greatestCommonDivisor(a, b);
}

function solveSecond() {
  const input = getInput();

  const instructions = input[0];
  const rawNodes = input.splice(1);

  const nodesInfo = parseInputRawNodes(rawNodes);
  const roots = Object.keys(nodesInfo).filter((key) => {
    return key.endsWith("A");
  });

  const stepsToReachEndForRoots = roots.map((root) => {
    return getStepsToEnd(nodesInfo[root], nodesInfo, instructions);
  });

  console.log(stepsToReachEndForRoots);

  const lcms = stepsToReachEndForRoots.reduce((acc, steps) => {
    return leastCommonMultiple(acc, steps);
  });

  return lcms;
}

// console.log("First solution: ", solveFirst());
console.log("Second solution: ", solveSecond());
