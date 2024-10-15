import { slice } from "lodash";
import { useMemo, useRef } from "react";

type ArrayOfNullable<T> = Array<T | null>;

function useStableList<T>(
  list: ArrayOfNullable<T>,
  getItemId: (item: T) => string | number
): ArrayOfNullable<T> {
  const stableListRef = useRef<ArrayOfNullable<T>>();

  return useMemo(() => {
    const oldList = stableListRef.current;
    if (!oldList) {
      stableListRef.current = list;
      return stableListRef.current;
    }

    const newIdSet = new Set(list.filter(Boolean).map(i => getItemId(i as T)));
    const oldIdSet = new Set(
      oldList.filter(Boolean).map(i => getItemId(i as T))
    );

    // Replace removed elements with `null`
    const listWithNull = oldList.map(item =>
      item && newIdSet.has(getItemId(item)) ? item : null
    );

    // Find the added items (items in the new list but not in the old list)
    const addedItems = list.filter(
      item => item !== null && !oldIdSet.has(getItemId(item as T))
    ) as T[];

    // Fill `null` slots with the new items
    let addedItemIndex = 0;
    const updatedList = listWithNull.map(item =>
      item === null && addedItemIndex < addedItems.length
        ? addedItems[addedItemIndex++]
        : item
    );

    // Update the ref to store the new stable list
    stableListRef.current = [
      ...updatedList,
      ...slice(addedItems, addedItemIndex),
    ];

    return updatedList;
  }, [list, getItemId]);
}

export default useStableList;
