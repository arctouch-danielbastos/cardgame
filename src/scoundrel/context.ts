import type { ScoundrelState } from "scoundrel/types";
import createGameContext from "ui/hooks/useGame";

export const { GameProvider, useGame } = createGameContext<ScoundrelState>();
