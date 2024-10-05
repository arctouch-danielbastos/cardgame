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

export const isClub = (card: Card) => card.suit === "club";
export const isDiamond = (card: Card) => card.suit === "diamond";
export const isHeart = (card: Card) => card.suit === "heart";
export const isSpade = (card: Card) => card.suit === "spade";

export const isRed = (card: Card) => isDiamond(card) || isHeart(card);
export const isBlack = (card: Card) => isClub(card) || isSpade(card);

export const hasDifferentColor = (cardA: Card, cardB: Card) => {
  return isRed(cardA) !== isRed(cardB);
};

export const suits: Suit[] = ["club", "diamond", "heart", "spade"];
export const buildDeck = (lower: number = 1, higher: number = 13) => {
  const cards: Card[] = [];

  for (const suit of suits) {
    range(lower, higher + 1).forEach(rank => cards.push({ suit, rank }));
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
