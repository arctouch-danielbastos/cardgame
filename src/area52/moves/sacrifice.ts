import type { Area52State } from "area52/model";
import type { Card } from "deck";
import { last, reject } from "lodash";

export default move({
  handler(state: Area52State, defender: Card) {
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
