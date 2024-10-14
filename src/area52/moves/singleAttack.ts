import type { Area52State } from "area52/types";
import { hasDifferentColor, type Card } from "deck";
import move from "framework/model/move";
import { validate } from "framework/model/validate";
import { last, reject } from "lodash";

const hasRightColor = validate<Area52State, Card>(
  "Defender and Attacker must have opposite colors",
  (state, defender) => {
    const attacker = last(state.attackers.active);
    if (!attacker) return false;
    return hasDifferentColor(attacker, defender);
  }
);

export default move({
  validations: [hasRightColor],
  handler(state: Area52State, defender: Card) {
    const activeAttackers = state.attackers.active;
    const activeDefenders = state.defenders.active;

    const attacker = last(activeAttackers);
    if (!attacker) return;

    state.discard.push(defender);
    state.defenders.active = reject(activeDefenders, defender);
    state.attackers.active = reject(activeAttackers, attacker);
  },
});
