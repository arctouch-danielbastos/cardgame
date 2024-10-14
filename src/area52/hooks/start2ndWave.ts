import { ATTACKER_COUNT, type Area52State } from "area52/types";
import { shuffleAndDraw } from "deck";
import { isEmpty, shuffle, slice, take } from "lodash";

export default buildHook({
  condition: (state: Area52State) =>
    isEmpty(state.attackers.active) &&
    isEmpty(state.attackers.deck) &&
    !state.is2nWave,

  handler(state: Area52State) {
    const [active, deck] = shuffleAndDraw(ATTACKER_COUNT, state.discard);
    state.attackers = { ...state.attackers, active, deck };
    state.discard = [];
    state.is2nWave = true;
  },
});
