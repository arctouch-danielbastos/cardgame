import { minBy } from "lodash";
import { ROOM_SIZE, type ScoundrelState } from "scoundrel/types";

export const hasSkipped = validate<ScoundrelState>(
  state => state.room.hasSkipped,
  "Can't skip twice in a row"
);

export const hasEntered = validate<ScoundrelState>(
  state => state.room.cards.length === ROOM_SIZE,
  "Can only flee a room before you entered it"
);

export const hasWeapon = validate(
  state => !!state.weapon.card,
  "You don't have a weapon"
);

export const isWeaponStrongEnough = validate((state, card) => {
  const weakestMonster = minBy(state.weapon.monster, "rank");
  return !weakestMonster || weakestMonster.rank > card.rank;
}, "Your weapon got weaker! It can't handle this monster");
