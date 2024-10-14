import { useGame } from "area52/context";
import dualAttack from "area52/moves/dualAttack";
import sacrifice from "area52/moves/sacrifice";
import singleAttack from "area52/moves/singleAttack";
import type { Area52State } from "area52/types";
import type { Card } from "deck";
import type { Move } from "framework/model/types";
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

type Props = {
  selected: Card[];
  onAttack: () => void;
};

const actions = [
  ["Dual Attack", dualAttack],
  ["Single Attack", singleAttack],
  ["Sacrifice", sacrifice],
] as const;

export default function ActionArea({ selected, onAttack }: Props) {
  const { state, game } = useGame();

  const buildHandler = (action: Move<Area52State, Card[]>) => () => {
    game.play(action(selected));
    onAttack();
  };

  return (
    <Wrapper>
      {actions.map(([label, action]) => (
        <ActionButton
          key={action.id}
          disabled={!action.isValid(state, selected)}
          onClick={buildHandler(action)}
        >
          {label}
        </ActionButton>
      ))}
    </Wrapper>
  );
}
