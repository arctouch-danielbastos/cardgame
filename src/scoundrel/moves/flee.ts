import { draw } from "deck";
import move from "framework/model/move";
import { ROOM_SIZE, type ScoundrelState } from "scoundrel/types";
import { hasEntered, hasSkipped } from "scoundrel/validations/state";

export default move({
  validations: [hasSkipped, hasEntered],
  handler(state: ScoundrelState) {
    const [room, deck] = draw(ROOM_SIZE, state.deck, state.room.cards);

    state.deck = deck;
    state.room.cards = room;
    state.room.hasSkipped = true;
  },
});
