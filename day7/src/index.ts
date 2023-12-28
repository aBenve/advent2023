import fs, { copyFileSync } from "fs";

console.log("Hello, TypeScript!");

function match<
  Key extends PropertyKey,
  ReturnValue,
  Branch extends () => ReturnValue,
  Options extends Record<Key, Branch>,
  Variant extends keyof Options
>(options: Options, variant: Variant): ReturnType<Options[Variant]>;
function match(
  options: Record<PropertyKey, () => unknown>,
  variant: PropertyKey
) {
  return options[variant]();
}

enum Card {
  Joker = 0,
  Two = 2,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  //   Jack,
  Quenn,
  King,
  Ace,
}

enum Hand {
  HighCard = 1,
  OnePair,
  TwoPairs,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}

function getInput() {
  return fs.readFileSync("./input/data.txt", "utf-8").split("\n");
}

type Game = {
  hand: Hand;
  bid: number;
  cards: Card[];
};

function parseInput(input: string[], withJoker = false) {
  return input.map((line) => {
    const [rawcards, bid] = line.split(" ");
    const cards = rawcards.split("").map(
      (card) =>
        match(
          {
            A: () => Card.Ace,
            T: () => Card.Ten,
            // J: () => Card.Jack,
            J: () => Card.Joker,
            Q: () => Card.Quenn,
            K: () => Card.King,
            2: () => Card.Two,
            3: () => Card.Three,
            4: () => Card.Four,
            5: () => Card.Five,
            6: () => Card.Six,
            7: () => Card.Seven,
            8: () => Card.Eight,
            9: () => Card.Nine,
          },
          card as "A" | "T" | "J" | "Q" | "K" | 3 | 2 | 4 | 5 | 6 | 7 | 8 | 9
        ) as Card
    );

    return {
      hand: detectHand(cards, withJoker),
      cards,
      bid: Number(bid),
    } as Game;
  });
}

function detectHand(cards: Card[], withJoker = false) {
  const cardMap = new Map<Card, number>();

  cards.forEach((card) => {
    cardMap.set(card, cardMap.get(card) + 1 || 1);
  });

  if (withJoker) {
    if (cardMap.has(Card.Joker)) {
      const jokerCount = cardMap.get(Card.Joker);
      cardMap.delete(Card.Joker);

      let [keyWithMaxValue, _] = Array.from(cardMap.entries()).reduce(
        ([maxKey, maxValue], [key, value]) => {
          return value > maxValue ? [key, value] : [maxKey, maxValue];
        },
        [-1, -Infinity]
      );

      cardMap.set(keyWithMaxValue, cardMap.get(keyWithMaxValue) + jokerCount);
    }
  }

  const values = Array.from(cardMap.values());

  return match(
    {
      1: () => Hand.FiveOfAKind,
      2: () => (values.includes(4) ? Hand.FourOfAKind : Hand.FullHouse),
      3: () => (values.includes(3) ? Hand.ThreeOfAKind : Hand.TwoPairs),
      4: () => Hand.OnePair,
      5: () => Hand.HighCard,
    },
    values.length as 1 | 2 | 3 | 4 | 5
  );
}

function solveFirst() {
  const input = getInput();

  const games = parseInput(input);

  games.sort((a, b) => {
    const byHand = a.hand - b.hand;
    if (byHand !== 0) return byHand;
    let byCards = 0;
    for (let i = 0; i < a.cards.length; i++) {
      byCards = a.cards[i] - b.cards[i];
      if (byCards !== 0) return byCards;
    }
    return 0;
  });

  return Object.entries(games).reduce((acc, [index, game]) => {
    return acc + game.bid * (parseInt(index) + 1);
  }, 0);
}

function solveSecond() {
  const input = getInput();

  const games = parseInput(input, true);

  games.sort((a, b) => {
    const byHand = a.hand - b.hand;
    if (byHand !== 0) return byHand;
    let byCards = 0;
    for (let i = 0; i < a.cards.length; i++) {
      byCards = a.cards[i] - b.cards[i];
      if (byCards !== 0) return byCards;
    }
    return 0;
  });

  return Object.entries(games).reduce((acc, [index, game]) => {
    return acc + game.bid * (parseInt(index) + 1);
  }, 0);
}

// console.log("First solution: ", solveFirst());
console.log("Second solution: ", solveSecond());
