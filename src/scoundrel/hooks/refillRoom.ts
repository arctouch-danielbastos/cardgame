import { fillHand } from "deck";
import buildHook from "framework/model/buildHook";
import { ROOM_SIZE, type ScoundrelState } from "scoundrel/types";

export default buildHook<ScoundrelState>({
  condition: state => state.room.cards.length === 1,
  handler(state) {
    const [room, deck] = fillHand(ROOM_SIZE, state.room.cards, state.deck);

    state.deck = deck;
    state.room = {
      cards: room,
      hasDrunkPotion: false,
      hasSkipped: false,
    };
  },
});
