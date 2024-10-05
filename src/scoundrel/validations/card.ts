import { isBlack, isDiamond, isHeart, type Card } from "deck";

const validateCard = validatePayload<any, Card>;

export const isPotion = validateCard(isHeart, "You can only drink potions");
export const isWeapon = validateCard(isDiamond, "You can only equip weapons");
export const isMonster = validateCard(isBlack, "You can only fight monsters");
