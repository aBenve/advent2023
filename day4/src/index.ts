import fs from "fs";
function openInputData() {
  return fs.readFileSync("./input/data.txt", "utf8").split("\n");
}

interface Card {
  id: number;
  winningNumbers: number[];
  numbers: number[];
}

function parseLine(line: string): Card {
  const splittedByColon = line.split(":");
  const id = parseInt(
    splittedByColon[0]
      .split(" ")
      .filter((char) => char.length > 0)[1]
      .trim()
  );

  const [numbers, winningNumbers] = splittedByColon[1]
    .trim()
    .split("|")
    .map((numbersString) =>
      numbersString
        .split(" ")
        .filter((numberChar) => numberChar.length > 0)
        .map((numberChar) => parseInt(numberChar.trim()))
    );
  return {
    id,
    winningNumbers,
    numbers,
  } as Card;
}

function solveFirst() {
  const input = openInputData();

  let total = 0;

  for (const line of input) {
    const card = parseLine(line);

    let cardPoints = 0;

    for (const number of card.numbers) {
      if (card.winningNumbers.includes(number)) {
        cardPoints === 0 ? (cardPoints = 1) : (cardPoints *= 2);
      }
    }

    total += cardPoints;
  }

  return total;
}

function solveSecond() {
  const input = openInputData();

  const scratchedCards: { [key: number]: number } = {};

  for (const line of input) {
    const card = parseLine(line);

    let amountOfScratches = 0;
    for (const number of card.numbers) {
      if (card.winningNumbers.includes(number)) {
        amountOfScratches += 1;
      }
    }

    const scratchedCardsWon = Array.from({ length: amountOfScratches }).map(
      (_, index) => index + 1 + card.id
    );

    let count = 0;

    do {
      for (let scratchedCardWonId of scratchedCardsWon) {
        scratchedCards[scratchedCardWonId]
          ? (scratchedCards[scratchedCardWonId] += 1)
          : (scratchedCards[scratchedCardWonId] = 1);
      }
    } while (count++ < scratchedCards[card.id]);
  }

  return (
    Object.values(scratchedCards).reduce(
      (acc, current) => (acc = acc + current),
      0
    ) + input.length
  );
}

// console.log("First solution is:", solveFirst());
// console.log("Second solution is:", solveSecond());
