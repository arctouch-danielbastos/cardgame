import type { Area52State } from "area52/types";
import buildResultPlugin from "framework/model/buildResultPlugin";
import { isEmpty } from "lodash";

export default buildResultPlugin<Area52State>({
  hasWon: state =>
    isEmpty(state.attackers.active) &&
    isEmpty(state.attackers.deck) &&
    state.is2nWave,

  hasLost: state =>
    isEmpty(state.defenders.active) && isEmpty(state.defenders.deck),

  onTie: "lost",
  checkAfter: "all",

  key: "winState",
});
