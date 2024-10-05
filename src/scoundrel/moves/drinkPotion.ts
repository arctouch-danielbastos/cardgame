import type { Card } from "deck";
import { reject } from "lodash";
import { MAX_HEALTH, type ScoundrelState } from "scoundrel/types";
import { isPotion } from "scoundrel/validations/card";

export default move({
  validations: [isPotion],
  handler(state: ScoundrelState, card: Card) {
    state.room.cards = reject(state.room.cards, card);
    if (!state.room.hasDrunkPotion) {
      state.health = Math.min(MAX_HEALTH, state.health + card.rank);
      state.room.hasDrunkPotion = true;
    }
  },
});
