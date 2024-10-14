import type { Area52State } from "area52/types";
import createGameContext from "ui/hooks/useGame";

export const { GameProvider, useGame } = createGameContext<Area52State>();
