import { buildDeck, isBlack, isRed, type Card } from "deck";
import type { Model } from "framework/model/types";

export type ScoundrelModel = Model<ScoundrelState>;
export type ScoundrelState = {
  deck: Card[];
  health: number;
  winState: "won" | "lost" | null;
  room: {
    cards: Card[];
    hasSkipped: boolean;
    hasDrunkPotion: boolean;
  };
  weapon: {
    card: Card | null;
    monsters: Card[];
  };
};

export const ROOM_SIZE = 4;
export const MAX_HEALTH = 20;
export const SCOUNDREL_DECK = buildDeck(2, 14).filter(card => {
  if (isBlack(card)) return true;
  if (isRed(card)) return card.rank <= 10;
});
