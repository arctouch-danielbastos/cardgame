import type { Area52State } from "area52/types";
import { hasDifferentColor, type Card } from "deck";
import move from "framework/model/move";
import { validate, validatePayload } from "framework/model/validate";
import { last, reject } from "lodash";

const hasRightColor = validate<Area52State, Card[]>(
  "Defender and Attacker must have opposite colors",
  (state, [defender]) => {
    const attacker = last(state.attackers.active);
    return !!attacker && hasDifferentColor(attacker, defender);
  }
);

const isOneCard = validatePayload<Card[]>(
  "Single attack accepts one attacker only",
  payload => payload.length === 1
);

export default move({
  validations: [isOneCard, hasRightColor],
  handler(state: Area52State, [defender]: Card[]) {
    const activeAttackers = state.attackers.active;
    const activeDefenders = state.defenders.active;

    const attacker = last(activeAttackers);
    if (!attacker) return;

    state.discard.push(defender);
    state.defenders.active.push(attacker);
    state.defenders.active = reject(activeDefenders, defender);
    state.attackers.active = reject(activeAttackers, attacker);
  },
});
