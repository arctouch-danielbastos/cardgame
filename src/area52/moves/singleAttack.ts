import type { Area52State } from "area52/model";
import { hasDifferentColor, type Card } from "deck";
import { last, reject } from "lodash";

const hasRightColor = validate((state: Area52State, defender: Card) => {
  const attacker = last(state.attackers.active);
  if (!attacker) return false;
  return hasDifferentColor(attacker, defender);
}, "Defender and Attacker must have opposite colors");

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
