import type { Area52State } from "area52/model";
import { isEmpty } from "lodash";

export default buildResultPlugin<Area52State>({
  hasWon: state =>
    isEmpty(state.attackers.active) &&
    isEmpty(state.attackers.deck) &&
    state.is2nWave,

  hasLost: state =>
    isEmpty(state.defenders.active) && isEmpty(state.defenders.deck),

  onTie: "lose",
  checkAfter: "all",
});
