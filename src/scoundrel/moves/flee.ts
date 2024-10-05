import { shuffleAndDraw } from "deck";
import { ROOM_SIZE, type ScoundrelState } from "scoundrel/types";
import { hasEntered, hasSkipped } from "scoundrel/validations/state";

export default move({
  validations: [hasSkipped, hasEntered],
  handler(state: ScoundrelState) {
    const [room, deck] = shuffleAndDraw(
      ROOM_SIZE,
      state.room.cards,
      state.deck
    );

    state.deck = deck;
    state.room.cards = room;
    state.room.hasSkipped = true;
  },
});
