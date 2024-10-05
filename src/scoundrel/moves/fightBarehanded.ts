import type { Card } from "deck";
import { reject } from "lodash";
import type { ScoundrelState } from "scoundrel/types";
import { isMonster } from "scoundrel/validations/card";

export default move({
  validations: [isMonster],
  handler(state: ScoundrelState, card: Card) {
    state.room.cards = reject(state.room.cards, card);
    state.health = Math.max(0, state.health - card.rank);
  },
});
