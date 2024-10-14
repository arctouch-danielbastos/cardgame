import type { ModelInitializer } from "framework/model/types";
import { useEffect, useMemo, useState } from "react";

export default function useGame<T extends object>(
  buildGame: ModelInitializer<void, T>
) {
  const game = useMemo(
    () => buildGame(),
    // once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [state, setState] = useState(game.state);

  useEffect(() => {
    game.subscribe(() => setState(game.state));
  }, [game]);

  return { game, state };
}
