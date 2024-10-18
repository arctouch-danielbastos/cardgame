import type { Model } from "framework/model/types";
import nullthrows from "nullthrows";
import { createContext, useContext, useEffect, useState } from "react";

type ContextData<State extends object> = {
  state: State;
  error: Error | null;
  game: Model<State>;
};
type Props<State extends object> = {
  game: Model<State>;
  children: React.ReactNode;
};

export default function createGameContext<State extends object>() {
  const Context = createContext<ContextData<State> | null>(null);

  const GameProvider = ({ game, children }: Props<State>) => {
    const [state, setState] = useState(game.state);
    const [error, setError] = useState(game.error);

    useEffect(() => {
      const fn = () => {
        setState(game.state);
        setError(game.error);
      };

      game.subscribe(fn);
      return () => game.unsubscribe(fn);
    }, [game]);

    return (
      <Context.Provider value={{ game, error, state }}>
        {children}
      </Context.Provider>
    );
  };

  const useGame = () => {
    return nullthrows(useContext(Context));
  };

  return { GameProvider, useGame };
}
