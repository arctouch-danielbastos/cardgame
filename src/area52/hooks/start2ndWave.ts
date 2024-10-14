import { ATTACKER_COUNT, type Area52State } from "area52/types";
import { shuffleAndDraw } from "deck";
import buildHook from "framework/model/buildHook";
import { isEmpty } from "lodash";

export default buildHook<Area52State>({
  condition: state =>
    isEmpty(state.attackers.active) &&
    isEmpty(state.attackers.deck) &&
    !state.is2nWave,

  handler(state) {
    const [active, deck] = shuffleAndDraw(ATTACKER_COUNT, state.discard);
    state.attackers = { ...state.attackers, active, deck };
    state.discard = [];
    state.is2nWave = true;
  },
});
