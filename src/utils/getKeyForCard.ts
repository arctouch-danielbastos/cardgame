import type { Card } from "deck";

export default function getKeyForCard({ suit, rank }: Card) {
  return `${rank}${suit}`;
}
