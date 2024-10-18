import Area52View from "area52/view";
import area52Model from "area52/model";
import { GameProvider } from "area52/context";
import { type RouteObject } from "react-router-dom";

export default {
  path: "/area52",
  element: (
    <GameProvider game={area52Model()}>
      <Area52View />
    </GameProvider>
  ),
} as RouteObject;
