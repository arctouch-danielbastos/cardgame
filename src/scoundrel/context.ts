import type { ScoundrelState } from "scoundrel/types";
import createGameContext from "ui/hooks/createGameContext";

export const { GameProvider, useGame } = createGameContext<ScoundrelState>();
