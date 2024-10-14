import { ATTACKER_COUNT, DEFENDER_COUNT, type Area52State } from "area52/types";
import { draw, fillHand } from "deck";
import buildHook from "framework/model/buildHook";
import { flow } from "lodash";

const handleAttackers = (state: Area52State) => {
  const [active, deck] = draw(ATTACKER_COUNT, state.attackers.deck);
  state.attackers = { ...state.attackers, active, deck };
};

const handleDefenders = (state: Area52State) => {
  const { defenders } = state;
  const [active, deck] = fillHand(
    DEFENDER_COUNT,
    defenders.active,
    defenders.deck
  );

  state.defenders = { ...state.defenders, active, deck };
};

export default buildHook<Area52State>({
  condition: state => state.attackers.active.length === 0,
  handler: flow(handleAttackers, handleDefenders),
});
