import { range } from "lodash";

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
