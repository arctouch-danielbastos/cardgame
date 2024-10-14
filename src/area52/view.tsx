import styled from "styled-components";
import { useState } from "react";
import { includes, without } from "lodash";
import { Title } from "ui/styles/typography";
import colors from "ui/styles/colors";
import type { Card } from "deck";
import { lastValid } from "utils/lastValid";
import Area from "ui/Area";
import ActionArea from "area52/ActionArea";
import Alerts from "area52/Alerts";
import VerticalLayout from "ui/VerticalLayout";
import { ufo, faceAlien, astronautHelmet } from "@lucide/lab";
import { Icon, Rocket } from "lucide-react";
import { buildCardUi } from "ui/buildCardUI";
import { useGame } from "area52/context";

const Area52Cards = buildCardUi({
  heart: <Icon iconNode={ufo} />,
  diamond: <Icon iconNode={faceAlien} />,
  spade: <Icon iconNode={astronautHelmet} />,
  club: <Rocket />,
});

const GameTitle = styled.div`
  ${Title};
  color: ${colors.blue};
`;

const useSelection = () => {
  const [selected, setSelected] = useState<Card[]>([]);

  const toggle = (card: Card) =>
    setSelected(cards => {
      if (includes(cards, card)) return without(cards, card);
      if (cards.length >= 2) return [cards[1], card];
      return [...cards, card];
    });

  const resetSelection = () => setSelected([]);

  return { selected, resetSelection, toggle };
};

export default function App() {
  const { state } = useGame();
  const { selected, toggle, resetSelection } = useSelection();

  return (
    <VerticalLayout>
      <GameTitle>area 52</GameTitle>
      <Area
        CardUI={Area52Cards}
        cards={state.attackers.active}
        activeCards={[lastValid(state.attackers.active) || null]}
        title="Attackers"
        count={state.attackers.deck.length}
      />
      <Area
        CardUI={Area52Cards}
        cards={state.defenders.active}
        activeCards={selected}
        onClickCard={toggle}
        title="Defenders"
        count={state.defenders.deck.length}
      />

      <ActionArea selected={selected} onAttack={resetSelection} />
      <Alerts />
    </VerticalLayout>
  );
}
