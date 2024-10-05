import type { Card } from "deck";
import { reject } from "lodash";
import nullthrows from "nullthrows";
import type { ScoundrelState } from "scoundrel/types";
import { isMonster } from "scoundrel/validations/card";
import { hasWeapon, isWeaponStrongEnough } from "scoundrel/validations/state";

export default move({
  validations: [isMonster, hasWeapon, isWeaponStrongEnough],
  handler(state: ScoundrelState, card: Card) {
    state.room.cards = reject(state.room.cards, card);

    const weapon = nullthrows(state.weapon.card);
    const damage = Math.max(card.rank - weapon.rank, 0);
    state.health = Math.max(0, state.health - damage);
    state.weapon.monsters.push(card);
  },
});
