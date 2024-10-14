import gameResult from "area52/gameResult";
import refillAttackers from "area52/hooks/refillAttackers";
import start2ndWave from "area52/hooks/start2ndWave";
import {
  ATTACKER_COUNT,
  BLACK_CARDS,
  DEFENDER_COUNT,
  RED_CARDS,
  type Area52State,
} from "area52/types";
import { shuffleAndDraw } from "deck";
import buildGame from "framework/model";

export default buildGame<Area52State>({
  afterEach: [refillAttackers, start2ndWave],
  result: gameResult,
  initState: () => {
    const [attackers, attackDeck] = shuffleAndDraw(ATTACKER_COUNT, RED_CARDS);
    const [defenders, defenseDeck] = shuffleAndDraw(
      DEFENDER_COUNT,
      BLACK_CARDS
    );

    return {
      attackers: { active: attackers, deck: attackDeck },
      defenders: { active: defenders, deck: defenseDeck },
      discard: [],
      is2nWave: false,
      winState: null,
    };
  },
});
