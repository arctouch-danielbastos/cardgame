import buildResultPlugin from "framework/model/buildResultPlugin";
import { isEmpty } from "lodash";
import type { ScoundrelState } from "scoundrel/types";

export default buildResultPlugin<ScoundrelState>({
  hasWon: state => isEmpty(state.deck) && isEmpty(state.room.cards),
  hasLost: state => state.health <= 0,
  onTie: "lost",
  checkAfter: "all",
  key: "winState",
});
