import type { Area52State } from "area52/model";
import type { Card } from "deck";
import tokens from "open-props";
import styled, { css } from "styled-components";
import colors from "ui/styles/colors";
import { Bold } from "ui/styles/typography";

const Wrapper = styled.div`
  gap: ${tokens.size2};
  border: none;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  padding: 0;
`;

const DisabledAction = css`
  cursor: default;
  pointer-events: none;
  opacity: 0.5;
`;

const Action = styled.button<{ disabled: boolean }>`
  ${Bold};
  background-color: ${colors.bg2};
  border-radius: ${tokens.radius2};
  border: ${tokens.borderSize3} solid ${colors.none};
  color: ${colors.fg};
  cursor: pointer;
  font-size: ${tokens.fontSize1};
  letter-spacing: ${tokens.fontLetterspacing1};
  outline: none;
  padding: ${tokens.size2} ${tokens.size5};
  ${p => (p.disabled ? DisabledAction : null)}

  &:hover {
    background-color: ${colors.bg3};
  }
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
  state: Area52State;
  onAttack: () => void;
};

const actions = [dualAttack, singleAttack, sacrifice];
export default function ActionArea({ selected, state, onAttack }: Props) {
  const buildHandler = (action: ActionConfig["action"]) => () => {
    action(state, selected);
    onAttack();
  };

  return (
    <Wrapper>
      {actions.map(action => (
        <Action
          key={action.id}
          disabled={!action.condition(state, selected)}
          onClick={buildHandler(action.action)}
        >
          {action.label}
        </Action>
      ))}
    </Wrapper>
  );
}
