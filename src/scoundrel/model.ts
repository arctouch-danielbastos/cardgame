import { shuffleAndDraw } from "deck";
import buildGame from "framework/model";
import gameResult from "scoundrel/gameResult";
import refillRoom from "scoundrel/hooks/refillRoom";
import {
  MAX_HEALTH,
  ROOM_SIZE,
  SCOUNDREL_DECK,
  ScoundrelState,
} from "scoundrel/types";

export default buildGame<ScoundrelState>({
  afterEach: [refillRoom],
  plugins: [gameResult],
  initState: () => {
    const [firstRoom, deck] = shuffleAndDraw(ROOM_SIZE, SCOUNDREL_DECK);

    return {
      deck,
      health: MAX_HEALTH,
      winState: null,
      room: {
        cards: firstRoom,
        hasSkipped: false,
        hasDrunkPotion: false,
      },
      weapon: {
        card: null,
        monsters: [],
      },
    };
  },
});
