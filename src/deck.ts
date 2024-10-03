import {
  filter,
  flatten,
  isNull,
  negate,
  range,
  shuffle,
  slice,
  take,
} from "lodash";

export type Suit = "heart" | "diamond" | "spade" | "club";
export type Card = { rank: number; suit: Suit };

export const suits: Suit[] = ["club", "diamond", "heart", "spade"];
const redSuits: Suit[] = ["diamond", "heart"];

export const isRed = (card: Card) => redSuits.includes(card.suit);
export const isBlack = (card: Card) => !isRed(card);
export const hasDifferentColor = (cardA: Card, cardB: Card) => {
  return isRed(cardA) !== isRed(cardB);
};

export const buildDeck = () => {
  const cards: Card[] = [];

  for (const suit of suits) {
    range(1, 14).forEach(rank => cards.push({ suit, rank }));
  }

  return cards;
};

export function draw(handSize: number, ...decks: Array<Card[]>) {
  const cards = flatten(decks);
  const hand = take(cards, handSize);
  const deck = slice(cards, handSize);
  return [hand, deck] as const;
}

export function shuffleAndDraw(handSize: number, ...decks: Array<Card[]>) {
  return draw(handSize, shuffle(flatten(decks)));
}

export function filterValid(cards: Array<Card | null>): Card[] {
  return filter(cards, negate(isNull)) as Card[];
}

export function fillHand(hand: Array<Card | null>, deck: Array<Card>) {
  const newDeck = [...deck];
  const newHand = hand.map(card =>
    !isNull(card) ? card : newDeck.pop() ?? null
  );
  return [newHand, newDeck] as const;
}
