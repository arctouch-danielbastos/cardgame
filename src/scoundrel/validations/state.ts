import type { Card } from "deck";
import { validate } from "framework/model/validate";
import { minBy } from "lodash";
import { ROOM_SIZE, type ScoundrelState } from "scoundrel/types";

export const hasSkipped = validate<ScoundrelState>(
  "Can't skip twice in a row",
  state => state.room.hasSkipped
);

export const hasEntered = validate<ScoundrelState>(
  "Can only flee a room before you entered it",
  state => state.room.cards.length === ROOM_SIZE
);

export const hasWeapon = validate<ScoundrelState, unknown>(
  "You don't have a weapon",
  state => !!state.weapon.card
);

export const isWeaponStrongEnough = validate<ScoundrelState, Card>(
  "Your weapon got weaker! It can't handle this monster",
  (state, card) => {
    const weakestMonster = minBy(state.weapon.monsters, "rank");
    return !weakestMonster || weakestMonster.rank > card.rank;
  }
);
