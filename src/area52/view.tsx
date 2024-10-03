import styled from "styled-components";
import { useState } from "react";
import area52Model from "area52/model";
import { includes, without } from "lodash";
import { Title } from "ui/styles/typography";
import colors from "ui/styles/colors";
import type { Card } from "deck";
import { lastValid } from "utils/lastValid";
import Area from "ui/Area";
import ActionArea from "area52/ActionArea";
import Alerts from "ui/Alerts";
import useModel from "ui/hooks/useModel";
import VerticalLayout from "ui/VerticalLayout";

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
  const { state } = useModel(area52Model);
  const { selected, toggle, resetSelection } = useSelection();

  return (
    <VerticalLayout>
      <GameTitle>area 52</GameTitle>
      <Area
        cards={state.attackers.active}
        activeCards={[lastValid(state.attackers.active) || null]}
        title="Attackers"
        count={state.attackers.deck.length}
      />
      <Area
        cards={state.defenders.active}
        activeCards={selected}
        onClickCard={toggle}
        title="Defenders"
        count={state.defenders.deck.length}
      />

      <ActionArea selected={selected} onAttack={resetSelection} state={state} />
      <Alerts state={state} />
    </VerticalLayout>
  );
}
