import { isEmpty } from "lodash";
import type { ScoundrelState } from "scoundrel/types";

export default buildResultManager<ScoundrelState>({
  hasWon: state => isEmpty(state.deck) && isEmpty(state.room.cards),
  hasLost: state => state.health <= 0,
  onTie: "lose",
  checkAfter: "all",
});
