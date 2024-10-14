import type { Area52State } from "area52/types";
import type { Card } from "deck";
import move from "framework/model/move";
import { validatePayload } from "framework/model/validate";
import { last, reject } from "lodash";

const isOneCard = validatePayload<Card[]>(
  "Single attack accepts one attacker only",
  payload => payload.length === 1
);

export default move({
  validations: [isOneCard],
  handler(state: Area52State, [defender]: Card[]) {
    const activeAttackers = state.attackers.active;
    const activeDefenders = state.defenders.active;

    const attacker = last(activeAttackers);
    if (!attacker) return;

    state.attackers.deck.push(attacker);
    state.attackers.active = reject(activeAttackers, attacker);
    state.discard.push(defender);
    state.defenders.active = reject(activeDefenders, defender);
  },
});
