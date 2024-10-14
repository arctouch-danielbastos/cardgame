import { filterValid, isBlack, type Card } from "deck";
import type { ScoundrelState } from "scoundrel/types";
import styled from "styled-components";
import tokens from "open-props";
import ActionButton from "ui/ActionButton";
import { Text } from "ui/styles/typography";
import colors from "ui/styles/colors";
import { useGame } from "scoundrel/context";

const Wrapper = styled.div`
  gap: ${tokens.size2};
  border: none;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  padding: 0;
`;

const Placeholder = styled.div`
  ${Text};
  color: ${colors.fg};
  font-size: ${tokens.fontSize2};
`;

type ActionConfig = {
  id: string;
  label: string;
  condition: (state: ScoundrelState, selected: Card | null) => boolean;
  action: (state: ScoundrelState, selected: Card | null) => void;
};

const useWeapon: ActionConfig = {
  id: "use-weapon",
  label: "Use weapon",
  condition: (_, selected) => !!selected && isBlack(selected),
  action: (state, selected) => {
    if (selected) state.fightWithWeapon(selected);
  },
};

const fightBarehanded: ActionConfig = {
  id: "fight-barehanded",
  label: "Fight barehanded",
  condition: (_, selected) => !!selected && isBlack(selected),
  action: (state, selected) => {
    if (selected) state.fightBarehanded(selected);
  },
};

const drinkPotion: ActionConfig = {
  id: "drink-potion",
  label: "Drink",
  condition: (_, selected) => selected?.suit === "heart",
  action: (state, selected) => {
    if (selected) state.drinkPotion(selected);
  },
};

const equipWeapon: ActionConfig = {
  id: "equip-weapon",
  label: "Equip weapon",
  condition: (_, selected) => selected?.suit === "diamond",
  action: (state, selected) => {
    if (selected) state.equipWeapon(selected);
  },
};

const flee: ActionConfig = {
  id: "flee",
  label: "Flee",
  condition: (state, selected) =>
    !state.room.hasSkipped &&
    filterValid(state.room.cards).length === 4 &&
    !selected,
  action: state => state.flee(),
};

const actions = [useWeapon, fightBarehanded, equipWeapon, drinkPotion, flee];

type Props = {
  selected: Card | null;
  afterAction: () => void;
};

export default function ActionList({ selected, afterAction }: Props) {
  const { state } = useGame();
  const handle = (action: ActionConfig["action"]) => {
    action(state, selected);
    afterAction();
  };

  const ctas = actions
    .filter(action => action.condition(state, selected))
    .map(action => (
      <ActionButton key={action.id} onClick={() => handle(action.action)}>
        {action.label}
      </ActionButton>
    ));

  const placeholder = <Placeholder>Select a card</Placeholder>;

  return <Wrapper>{ctas.length > 0 ? ctas : placeholder}</Wrapper>;
}
