import type { ModelInitializer } from "framework/model/types";
import { useEffect, useMemo, useState } from "react";

export default function useModel<T extends object>(
  buildModel: ModelInitializer<void, T>
) {
  const model = useMemo(
    () => buildModel(),
    // once on render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [state, setState] = useState(model.state);

  useEffect(() => {
    model.subscribe(() => setState(model.state));
  }, [model]);

  return { model, state };
}
