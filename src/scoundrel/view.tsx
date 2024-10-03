import styled from "styled-components";
import { isEqual, takeRight } from "lodash";
import { Title } from "ui/styles/typography";
import colors from "ui/styles/colors";
import Area from "ui/Area";
import useModel from "ui/hooks/useModel";
import scoundrelModel from "scoundrel/model";
import VerticalLayout from "ui/VerticalLayout";
import { useState } from "react";
import type { Card } from "deck";
import ActionList from "scoundrel/ActionList";
import { Icon, SkullIcon, SwordsIcon } from "lucide-react";
import { cauldron, faceAlien } from "@lucide/lab";
import { buildCardUi } from "ui/buildCardUI";

const ScoundrelCards = buildCardUi({
  heart: <Icon iconNode={cauldron} />,
  diamond: <SwordsIcon />,
  spade: <Icon iconNode={faceAlien} />,
  club: <SkullIcon />,
});

const GameTitle = styled.div`
  ${Title};
  color: ${colors.blue};
`;

export default function App() {
  const { state } = useModel(scoundrelModel);
  const [selected, setSelected] = useState<Card | null>(null);
  const clear = () => setSelected(null);
  const toggle = (card: Card) => {
    setSelected(previous => (isEqual(previous, card) ? null : card));
  };

  const weaponRow = [state.weapon.card, ...takeRight(state.weapon.monsters, 3)];
  return (
    <VerticalLayout>
      <GameTitle>{state.health}</GameTitle>
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
    </VerticalLayout>
  );
}
