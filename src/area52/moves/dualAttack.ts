import type { Area52State } from "area52/types";
import { hasDifferentColor, type Card } from "deck";
import move from "framework/model/move";
import { validate } from "framework/model/validate";
import { last, reject, sumBy } from "lodash";

type Props = [Card, Card];

const canDualAttack = validate(
  "Invalid attackers for a dual attack",
  (state: Area52State, defenders: Props) => {
    const attacker = last(state.attackers.active);
    if (!attacker) return false;
    const attack = attacker.rank;
    const deffense = sumBy(defenders, "rank");
    return attack === deffense;
  }
);

export default move({
  validations: [canDualAttack],
  handler(state: Area52State, defenders: Props) {
    const activeAttackers = state.attackers.active;
    const attacker = last(activeAttackers);
    if (!attacker) return;

    state.discard.push(attacker);
    state.attackers.active = reject(activeAttackers, attacker);

    if (!state.is2nWave) return;

    for (const card of defenders) {
      if (hasDifferentColor(card, attacker)) continue;
      state.defenders.active = reject(state.defenders.active, card);
      state.discard.push(card);
    }
  },
});
