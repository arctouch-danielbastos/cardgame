import type { Area52State } from "area52/model";
import { isEmpty, shuffle, slice, take } from "lodash";

export default buildHook({
  condition(state: Area52State) {
    return (
      isEmpty(state.attackers.active) &&
      isEmpty(state.attackers.deck) &&
      !state.is2nWave
    );
  },
  handler(state: Area52State) {
    const shuffledDiscard = shuffle(state.discard);
    state.attackers.active = take(shuffledDiscard, 3);
    state.attackers.deck = slice(shuffledDiscard, 3);
    state.discard = [];
    state.is2nWave = true;
  },
});
