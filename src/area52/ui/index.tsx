import tokens from "open-props";
import styled from "styled-components";
import colors from "area52/styles/color";
import { useEffect, useRef, useState } from "react";
import area52Model from "area52/model";
import { Card } from "area52/deck/types";
import { includes, without } from "lodash";
import Area from "area52/ui/Area";
import { lastValid } from "area52/utils/lastValid";
import ActionArea from "area52/ui/ActionArea";
import { Title } from "area52/styles/typography";
import Alerts from "area52/ui/Alerts";

const Wrapper = styled.div`
  align-items: center;
  display: inline-flex;
  flex-direction: column;
  gap: ${tokens.size5};
  padding-top: ${tokens.size10};

  @media (max-width: 500px) {
    padding-top: ${tokens.size3};
  }
`;

const GameTitle = styled.div`
  ${Title};
  color: ${colors.blue};
`;

const useModel = () => {
  const model = useRef(area52Model()).current;
  const [state, setState] = useState(model.state);
  useEffect(() => {
    model.subscribe(() => setState(model.state));
  }, [model]);

  return { model, state };
};

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
  const { state } = useModel();
  const { selected, toggle, resetSelection } = useSelection();

  return (
    <Wrapper>
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
    </Wrapper>
  );
}
