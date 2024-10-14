import { useGame } from "area52/context";
import type { Area52State } from "area52/types";
import type { Card } from "deck";
import tokens from "open-props";
import styled from "styled-components";
import ActionButton from "ui/ActionButton";

const Wrapper = styled.div`
  gap: ${tokens.size2};
  border: none;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  padding: 0;
`;

type ActionConfig = {
  id: string;
  label: string;
  condition: (state: Area52State, selected: Card[]) => boolean;
  action: (state: Area52State, selected: Card[]) => void;
};

const dualAttack: ActionConfig = {
  id: "dual-attack",
  label: "Dual Attack",
  condition: (_, selected) => selected.length === 2,
  action(state, selected) {
    state.dualAttack({ defenders: selected as [Card, Card] });
  },
};

const singleAttack: ActionConfig = {
  id: "single-attack",
  label: "Single Attack",
  condition: (_, selected) => selected.length === 1,
  action(state, selected) {
    state.singleAttack({ defender: selected[0] });
  },
};

const sacrifice: ActionConfig = {
  id: "sacrifice",
  label: "Sacrifice",
  condition: (_, selected) => selected.length === 1,
  action(state, selected) {
    state.sacrifice({ defender: selected[0] });
  },
};

type Props = {
  selected: Card[];
  onAttack: () => void;
};

const actions = [dualAttack, singleAttack, sacrifice];
export default function ActionArea({ selected, onAttack }: Props) {
  const { state } = useGame();

  const buildHandler = (action: ActionConfig["action"]) => () => {
    action(state, selected);
    onAttack();
  };

  return (
    <Wrapper>
      {actions.map(action => (
        <ActionButton
          key={action.id}
          disabled={!action.condition(state, selected)}
          onClick={buildHandler(action.action)}
        >
          {action.label}
        </ActionButton>
      ))}
    </Wrapper>
  );
}
