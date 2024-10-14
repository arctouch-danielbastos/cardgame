import ActionList from "scoundrel/ActionList";
import Area from "ui/Area";
import GameOverNotice from "scoundrel/GameOverNotice";
import LifeBar from "ui/LifeBar";
import ScoundrelLogo from "scoundrel/logo.svg?react";
import VerticalLayout from "ui/VerticalLayout";
import scoundrelModel from "scoundrel/model";
import styled from "styled-components";
import tokens from "open-props";
import type { Card } from "deck";
import useGame from "ui/hooks/useGame";
import { Icon, SkullIcon, SwordsIcon } from "lucide-react";
import { buildCardUi } from "ui/buildCardUI";
import { cauldron, faceAlien } from "@lucide/lab";
import { isEqual, takeRight } from "lodash";
import { useState } from "react";

const ScoundrelCards = buildCardUi({
  heart: <Icon iconNode={cauldron} />,
  diamond: <SwordsIcon />,
  spade: <Icon iconNode={faceAlien} />,
  club: <SkullIcon />,
});

const LifeWrapper = styled.div`
  margin: 0 auto;
  margin-bottom: ${tokens.size3};
  width: 80%;
  padding: ${tokens.size3};
`;

const Section = styled.div`
  display: flex;
  justify-content: center;
`;

export default function App() {
  const { state } = useGame(scoundrelModel);
  const [selected, setSelected] = useState<Card | null>(null);
  const clear = () => setSelected(null);
  const toggle = (card: Card) => {
    setSelected(previous => (isEqual(previous, card) ? null : card));
  };

  const weaponRow = [state.weapon.card, ...takeRight(state.weapon.monsters, 3)];
  return (
    <VerticalLayout>
      <Section>
        <ScoundrelLogo />
      </Section>
      <LifeWrapper>
        <LifeBar health={state.health} max={20} />
      </LifeWrapper>
      <Area
        CardUI={ScoundrelCards}
        rowSize={4}
        cards={weaponRow}
        title="Weapon"
      />
      <Area
        CardUI={ScoundrelCards}
        activeCards={[selected]}
        cards={state.room.cards}
        count={state.deck.length}
        onClickCard={toggle}
        rowSize={4}
        title="Dungeon"
      />
      <ActionList state={state} afterAction={clear} selected={selected} />
      <GameOverNotice state={state} />
    </VerticalLayout>
  );
}
