import type { Card } from "deck";
import move from "framework/model/move";
import { reject } from "lodash";
import type { ScoundrelState } from "scoundrel/types";
import { isWeapon } from "scoundrel/validations/card";

export default move({
  validations: [isWeapon],
  handler(state: ScoundrelState, card: Card) {
    state.room.cards = reject(state.room.cards, card);
    state.weapon.card = card;
    state.weapon.monsters = [];
  },
});
