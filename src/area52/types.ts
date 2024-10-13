import { buildDeck, isBlack, isRed, type Card } from "deck";
import type { Model } from "framework/model/types";

export type Area52State = {
  attackers: { active: Card[]; deck: Card[] };
  defenders: { active: Card[]; deck: Card[] };
  discard: Card[];
  is2nWave: boolean;
  winState: null | "won" | "lost";
};

export const BLACK_CARDS = buildDeck().filter(isBlack);
export const RED_CARDS = buildDeck().filter(isRed);
export const ATTACKER_COUNT = 3;
export const DEFENDER_COUNT = 6;

export type Area52Model = Model<Area52State>;
