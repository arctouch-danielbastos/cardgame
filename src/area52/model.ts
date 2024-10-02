import { buildDeck, hasDifferentColor, isBlack, isRed, type Card } from "deck";
import buildModel from "framework/model";
import type { Hook, Model, MoveConfig } from "framework/model/types";
import {
  filter,
  isEmpty,
  isNull,
  map,
  negate,
  shuffle,
  slice,
  sumBy,
  take,
} from "lodash";
import { lastValid } from "utils/lastValid";
import replaceWith from "utils/replaceWith";
import topOff from "utils/topOff";

export type Area52State = {
  attackers: { active: Array<Card | null>; deck: Array<Card | null> };
  defenders: { active: Array<Card | null>; deck: Array<Card | null> };
  discard: Card[];
  is2nWave: boolean;
  winState: null | "won" | "lost";
  dualAttack: (props: DualAttackProps) => void;
  singleAttack: (props: SingleAttackProps) => void;
  sacrifice: (props: SacrificeProps) => void;
};

type DualAttackProps = { defenders: [Card, Card] };
const dualAttack: MoveConfig<Area52State, DualAttackProps> = {
  validations(state, { defenders }) {
    const attacker = lastValid(state.attackers.active);
    if (!attacker) throw new Error("No attacker");
    if (attacker.rank !== sumBy(defenders, "rank")) {
      throw new Error("Invalid attackers");
    }
  },
  handler(state, { defenders }) {
    const activeAttackers = state.attackers.active;
    const attacker = lastValid(activeAttackers);
    if (!attacker) return;

    state.discard.push(attacker);
    state.attackers.active = replaceWith(activeAttackers, attacker, null);

    if (!state.is2nWave) return;

    for (const card of defenders) {
      if (hasDifferentColor(card, attacker)) continue;
      state.defenders.active = replaceWith(state.defenders.active, card, null);
      state.discard.push(card);
    }
  },
};

type SingleAttackProps = { defender: Card };
const singleAttack: MoveConfig<Area52State, SingleAttackProps> = {
  validations(state, { defender }) {
    const attacker = lastValid(state.attackers.active);
    if (!attacker) throw new Error("No attacker");
    if (attacker.rank >= defender.rank) {
      throw new Error("Defender must have higher suit than attacker");
    }
    if (!hasDifferentColor(defender, attacker)) {
      throw new Error("Defender and Attacker must have opposite colors");
    }
  },
  handler(state, { defender }) {
    const activeAttackers = state.attackers.active;
    const activeDefenders = state.defenders.active;

    const attacker = lastValid(activeAttackers);
    if (!attacker) return;

    state.discard.push(defender);
    state.defenders.active = replaceWith(activeDefenders, defender, attacker);
    state.attackers.active = replaceWith(activeAttackers, attacker, null);
  },
};

type SacrificeProps = { defender: Card };
const sacrifice: MoveConfig<Area52State, SacrificeProps> = {
  handler(state, { defender }) {
    const activeAttackers = state.attackers.active;
    const activeDefenders = state.defenders.active;

    const attacker = lastValid(activeAttackers);
    if (!attacker) return;

    state.attackers.deck.push(attacker);
    state.attackers.active = replaceWith(activeAttackers, attacker, null);
    state.discard.push(defender);
    state.defenders.active = replaceWith(activeDefenders, defender, null);
  },
};

const start2ndWave: Hook<Area52State> = {
  condition(state) {
    const activeAttackers = filter(state.attackers.active, negate(isNull));
    return (
      isEmpty(activeAttackers) &&
      isEmpty(state.attackers.deck) &&
      !state.is2nWave
    );
  },
  handler(state) {
    const shuffledDiscard = shuffle(state.discard);
    state.attackers.active = take(shuffledDiscard, 3);
    state.attackers.deck = slice(shuffledDiscard, 3);
    state.discard = [];
    state.is2nWave = true;
  },
};

const checkGameOver: Hook<Area52State> = {
  handler(state) {
    const activeAttackers = filter(state.attackers.active, negate(isNull));
    const hasWon =
      isEmpty(activeAttackers) &&
      isEmpty(state.attackers.deck) &&
      state.is2nWave;

    if (hasWon) {
      state.winState = "won";
      return;
    }

    const activeDefenders = filter(state.defenders.active, negate(isNull));
    const hasLost = isEmpty(activeDefenders) && isEmpty(state.defenders.deck);
    if (hasLost) {
      state.winState = "lost";
    }
  },
};

const refill: Hook<Area52State> = {
  condition(state) {
    const activeAttackers = filter(state.attackers.active, negate(isNull));
    return activeAttackers.length === 0;
  },
  handler(state) {
    const { attackers, defenders } = state;
    state.attackers = {
      ...state.attackers,
      active: topOff(take(attackers.deck, 3), 3),
      deck: slice(attackers.deck, 3),
    };

    state.defenders.active = map(defenders.active, card =>
      !isNull(card) ? card : defenders.deck.pop() ?? null
    );
  },
};

const area52Model = buildModel<Area52State>({
  afterEach: [refill, start2ndWave, checkGameOver],
  state: ({ move }) => {
    const defenseDeck = shuffle(buildDeck().filter(isBlack));
    const attackDeck = shuffle(buildDeck().filter(isRed));

    return {
      attackers: { active: take(attackDeck, 3), deck: slice(attackDeck, 3) },
      defenders: { active: take(defenseDeck, 6), deck: slice(defenseDeck, 6) },
      discard: [],
      is2nWave: false,
      winState: null,
      dualAttack: move(dualAttack),
      singleAttack: move(singleAttack),
      sacrifice: move(sacrifice),
    };
  },
});

export type Area52Model = Model<Area52State>;
export default area52Model;
