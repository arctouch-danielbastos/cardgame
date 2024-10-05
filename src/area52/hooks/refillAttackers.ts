import type { Area52State } from "area52/model";
import { slice, take } from "lodash";

export default buildHook({
  condition: (state: Area52State) => state.attackers.active.length === 0,
  handler(state: Area52State) {
    const { attackers, defenders } = state;
    state.attackers = {
      ...state.attackers,
      active: take(attackers.deck, 3),
      deck: slice(attackers.deck, 3),
    };

    const newDefenders = [...defenders.active];
    while (newDefenders.length < 6 && defenders.deck.length) {
      newDefenders.push(defenders.deck.pop()!);
    }
    state.defenders.active = newDefenders;
  },
});
