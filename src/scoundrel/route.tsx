import ScoundrelView from "scoundrel/view";
import scoundrelModel from "scoundrel/model";
import { GameProvider } from "scoundrel/context";
import { type RouteObject } from "react-router-dom";

export default {
  path: "/",
  element: (
    <GameProvider game={scoundrelModel()}>
      <ScoundrelView />
    </GameProvider>
  ),
} as RouteObject;
