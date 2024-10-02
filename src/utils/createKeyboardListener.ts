type Modifiers = "cmd" | "ctrl" | "alt" | "shift";
const SEPARATOR = /\s?\+\s?/;
const SPLIT_LIST = /\s?,\s?/;

const processKey = (originalKey: string) => {
  const key = originalKey.toLowerCase();
  if (key === " ") return "space";
  if (key === "escape") return "esc";
  if (key.startsWith("arrow")) return key.replace("arrow", "");
  return key;
};

const parseEvKeys = (
  ev: KeyboardEvent
): { key: string; modifiers: { [key in Modifiers]: boolean } } => {
  return {
    key: processKey(ev.key),
    modifiers: {
      cmd: ev.metaKey,
      ctrl: ev.ctrlKey,
      alt: ev.altKey,
      shift: ev.shiftKey,
    },
  };
};

function isModifier(key: string): key is NonNullable<Modifiers> {
  return ["cmd", "ctrl", "alt", "shift"].includes(key);
}

function matches(shortcut: string, ev: KeyboardEvent) {
  const keyList = shortcut.split(SEPARATOR);
  const evKeys = parseEvKeys(ev);

  const hasModifiers = (Object.keys(evKeys.modifiers) as Modifiers[])
    .filter((key: Modifiers) => evKeys.modifiers[key])
    .every(key => keyList.includes(key));

  return (
    hasModifiers &&
    keyList.every(key => {
      return !isModifier(key) ? evKeys.key === key : evKeys.modifiers[key];
    })
  );
}

export type KeyboardEventHandler = (ev: KeyboardEvent) => void;
export type KeyboardHandlerMap = { [key: string]: KeyboardEventHandler };
export type KeyboardHandlerOptions = {
  propagate: boolean;
  keepDefault: boolean;
};

export default function createKeyboardHandler(
  keyMap: KeyboardHandlerMap,
  options: Partial<KeyboardHandlerOptions> = {}
): KeyboardEventHandler {
  return ev => {
    for (const [shortcut, handler] of Object.entries(keyMap)) {
      if (!handler) continue;

      const hasMatchingKey = shortcut
        .split(SPLIT_LIST)
        .some(keymap => matches(keymap, ev));

      if (!hasMatchingKey && shortcut !== "*") continue;
      if (!options.propagate) ev.stopPropagation();
      if (!options.keepDefault) ev.preventDefault();
      handler(ev);
    }
  };
}
