import { fillHand } from "deck";
import { ROOM_SIZE, type ScoundrelState } from "scoundrel/types";

export default buildHook({
  condition: (state: ScoundrelState) => state.room.cards.length === 1,
  handler(state: ScoundrelState) {
    const [room, deck] = fillHand(ROOM_SIZE, state.room.cards, state.deck);

    state.deck = deck;
    state.room = {
      cards: room,
      hasDrunkPotion: false,
      hasSkipped: false,
    };
  },
});
