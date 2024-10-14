import type { ScoundrelState } from "scoundrel/types";
import styled from "styled-components";
import tokens from "open-props";
import ActionButton from "ui/ActionButton";
import { Text } from "ui/styles/typography";
import colors from "ui/styles/colors";
import { useGame } from "scoundrel/context";
import flee from "scoundrel/moves/flee";
import equipWeapon from "scoundrel/moves/equipWeapon";
import fightBarehanded from "scoundrel/moves/fightBarehanded";
import fightWithWeapon from "scoundrel/moves/fightWithWeapon";
import drinkPotion from "scoundrel/moves/drinkPotion";
import type { Move } from "framework/model/types";
import type { Card } from "deck";

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

const actions = [
  ["Equip weapon", equipWeapon],
  ["Fight barehanded", fightBarehanded],
  ["Fight with weapon", fightWithWeapon],
  ["Drink potion", drinkPotion],
] as const;

type Props = {
  selected: Card | null;
  afterAction: () => void;
};

export default function ActionList({ selected, afterAction }: Props) {
  const { state, game } = useGame();
  const handle = (action: Move<ScoundrelState, Card>) => {
    if (!selected) return;
    game.play(action(selected));
    afterAction();
  };

  const handleFlee = () => {
    game.play(flee());
    afterAction();
  };

  if (!selected) return <ActionButton onClick={handleFlee}>Flee</ActionButton>;

  const ctas = actions
    .filter(([, action]) => action.isValid(state, selected))
    .map(([label, action]) => (
      <ActionButton key={action.id} onClick={() => handle(action)}>
        {label}
      </ActionButton>
    ));

  const placeholder = <Placeholder>Select a card</Placeholder>;

  return <Wrapper>{ctas.length > 0 ? ctas : placeholder}</Wrapper>;
}
