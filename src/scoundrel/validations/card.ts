import { isBlack, isDiamond, isHeart, type Card } from "deck";
import { validatePayload } from "framework/model/validate";

const validateCard = validatePayload<Card>;

export const isPotion = validateCard("You can only drink potions", isHeart);
export const isWeapon = validateCard("You can only equip weapons", isDiamond);
export const isMonster = validateCard("You can only fight monsters", isBlack);
