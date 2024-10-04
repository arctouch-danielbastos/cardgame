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
import type { Model } from "framework/model/types";
import { filter, isEmpty, isNull, minBy, negate } from "lodash";
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

const isGameOver = (state: ScoundrelState) => {
  if (state.winState) throw new Error("Can't play after game over");
};

const ROOM_SIZE = 4;
const MAX_HEALTH = 20;
const SCOUNDREL_DECK = buildDeck(2, 14).filter(card => {
  if (isBlack(card)) return true;
  if (isRed(card)) return card.rank <= 10;
});

const flee = move({
  validations(state) {
    isGameOver(state);
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
});

const isPotion = validation<ScoundrelState, Card>(
  (_, card) => isHeart(card),
  "You can only drink potions"
);

const drinkPotion = move({
  validations: [isPotion],
  handler(state, card) {
    state.room.cards = replaceWith(state.room.cards, card, null);
    if (!state.room.hasDrunkPotion) {
      state.health = Math.min(MAX_HEALTH, state.health + card.rank);
      state.room.hasDrunkPotion = true;
    }
  },
});

const isWeapon = validation<ScoundrelState, Card>(
  (_, card) => isDiamond(card),
  "You can only equip weapons"
);

const equipWeapon = move<ScoundrelState, Card>({
  validations: [isWeapon],
  handler(state, card) {
    state.room.cards = replaceWith(state.room.cards, card, null);
    state.weapon.card = card;
    state.weapon.monsters = [];
  },
});

const isMonster = validate(
  (_, card) => isBlack(card),
  "You can only fight monsters"
);

const fightBarehanded = move({
  validations: [isMonster],
  handler(state, card) {
    state.room.cards = replaceWith(state.room.cards, card, null);
    state.health = Math.max(0, state.health - card.rank);
  },
});

const hasWeapon = validate(
  state => !!state.weapon.card,
  "You don't have a weapon"
);

const isWeaponStrongEnough = validate((state, card) => {
  const weakestMonster = minBy(state.weapon.monster, "rank");
  return !weakestMonster || weakestMonster.rank > card.rank;
}, "Your weapon got weaker! It can't handle this monster");

const fightWithWeapon = move({
  validations: [isMonster, hasWeapon, isWeaponStrongEnough],
  handler(state, card) {
    state.room.cards = replaceWith(state.room.cards, card, null);

    const weapon = nullthrows(state.weapon.card);
    const damage = Math.max(card.rank - weapon.rank, 0);
    state.health = Math.max(0, state.health - damage);
    state.weapon.monsters.push(card);
  },
});

const refillRoom = buildHook({
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
});

const gameResult = buildResultManager<ScoundrelState>({
  hasWon: state => isEmpty(state.deck) && isEmpty(state.room.cards),
  hasLost: state => state.health <= 0,
  onTie: "lose",
  checkAfter: "all",
});

const scoundrelModel = buildModel<ScoundrelState>({
  afterEach: [checkGameOver, refillRoom],
  result: gameResult,
  buildState: () => {
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

export type ScoundrelModel = Model<ScoundrelState>;
export default scoundrelModel;
