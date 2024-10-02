import type { Card } from "area52/deck/types";

export default function getKeyForCard({ suit, rank }: Card) {
  return `${rank}${suit}`;
}
