import {
  buildDeck,
  fillHand,
  filterValid,
  isBlack,
  isRed,
  shuffleAndDraw,
  type Card,
} from "deck";
import buildModel from "framework/model";
import type { Hook, Model, MoveConfig } from "framework/model/types";
import { filter, isNull, minBy, negate } from "lodash";
import nullthrows from "nullthrows";
import replaceWith from "utils/replaceWith";

export type ScoundrelState = {
  deck: Card[];
  health: number;
  winState: "won" | "lost" | null;
  room: {
    cards: Array<Card | null>;
    hasSkipped: boolean;
    hasDrunkPotion: boolean;
  };
  weapon: {
    card: Card | null;
    monsters: Card[];
  };
  flee: () => void;
  drinkPotion: (card: Card) => void;
  equipWeapon: (card: Card) => void;
  fightBarehanded: (card: Card) => void;
  fightWithWeapon: (card: Card) => void;
};

const ROOM_SIZE = 4;
const MAX_HEALTH = 20;
const SCOUNDREL_DECK = buildDeck().filter(card => {
  if (isBlack(card)) return true;
  if (isRed(card)) return card.rank >= 2 && card.rank <= 10;
});

const flee: MoveConfig<ScoundrelState, void> = {
  validations(state) {
    if (state.room.hasSkipped) {
      throw new Error("Can't skip the same room twice");
    }
    if (filterValid(state.room.cards).length !== ROOM_SIZE) {
      throw new Error("Can only flee a room before you enter it");
    }
  },
  handler(state) {
    const [room, deck] = shuffleAndDraw(
      ROOM_SIZE,
      filter(state.room.cards, negate(isNull)) as Card[],
      state.deck
    );

    state.deck = deck;
    state.room.cards = room;
    state.room.hasSkipped = true;
  },
};

const drinkPotion: MoveConfig<ScoundrelState, Card> = {
  validations(_, card) {
    if (card.suit !== "heart") throw new Error("Can't drink non-potion");
  },
  handler(state, card) {
    state.room.cards = replaceWith(state.room.cards, card, null);
    if (!state.room.hasDrunkPotion) {
      state.health = Math.min(MAX_HEALTH, state.health + card.rank);
      state.room.hasDrunkPotion = true;
    }
  },
};

const equipWeapon: MoveConfig<ScoundrelState, Card> = {
  validations(_, card) {
    if (card.suit !== "diamond") throw new Error("Can't equip non-weapon");
  },
  handler(state, card) {
    state.room.cards = replaceWith(state.room.cards, card, null);
    state.weapon.card = card;
    state.weapon.monsters = [];
  },
};

const fightBarehanded: MoveConfig<ScoundrelState, Card> = {
  validations(_, card) {
    if (!isBlack(card)) throw new Error("Can't fight non-monster");
  },
  handler(state, card) {
    state.room.cards = replaceWith(state.room.cards, card, null);
    state.health = Math.max(0, state.health - card.rank);
  },
};

const fightWithWeapon: MoveConfig<ScoundrelState, Card> = {
  validations(state, card) {
    if (!isBlack(card)) throw new Error("Can't fight non-monster");
    if (!state.weapon.card) throw new Error("You don't have a weapon");
    const lastMonster = minBy(state.weapon.monsters, "rank");
    if (lastMonster && card.rank >= lastMonster.rank) {
      throw new Error("Your weapon got weaker! It can't handle this monster");
    }
  },
  handler(state, card) {
    state.room.cards = replaceWith(state.room.cards, card, null);

    const weapon = nullthrows(state.weapon.card);
    const damage = Math.max(card.rank - weapon.rank, 0);
    state.health = Math.max(0, state.health - damage);
    state.weapon.monsters.push(card);
  },
};

const refillRoom: Hook<ScoundrelState> = {
  condition: state => filterValid(state.room.cards).length === 1,
  handler(state) {
    const [room, deck] = fillHand(state.room.cards, state.deck);

    state.deck = deck;
    state.room = {
      cards: room,
      hasDrunkPotion: false,
      hasSkipped: false,
    };
  },
};

const isGameOver: Hook<ScoundrelState> = {
  handler(state) {
    if (state.health <= 0) {
      state.winState = "lost";
      return;
    }

    if (state.deck.length === 0 && filterValid(state.room.cards).length === 0) {
      state.winState = "won";
      return;
    }
  },
};

const scoundrelModel = buildModel<ScoundrelState>({
  afterEach: [isGameOver, refillRoom],
  state: ({ move }) => {
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
      flee: move(flee),
      drinkPotion: move(drinkPotion),
      equipWeapon: move(equipWeapon),
      fightBarehanded: move(fightBarehanded),
      fightWithWeapon: move(fightWithWeapon),
    };
  },
});

export type ScoundrelModel = Model<ScoundrelState>;
export default scoundrelModel;
