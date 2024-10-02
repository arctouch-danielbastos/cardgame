import tokens from "open-props";
import CardUI from "area52/ui/CardUI";
import styled from "styled-components";
import colors from "area52/styles/color";
import { Card } from "area52/deck/types";
import { includes } from "lodash";
import getKeyForCard from "area52/utils/getKeyForCard";
import { Bold } from "area52/styles/typography";
import { LayersIcon } from "lucide-react";

const Wrapper = styled.div`
  border-radius: ${tokens.radius2};
  border: ${tokens.borderSize3} solid ${colors.bg2};
  display: grid;
  gap: ${tokens.sizeFluid2};
  grid-template-columns: repeat(3, auto);
  justify-content: flex-start;
  padding: ${tokens.size5} ${tokens.size3};
  position: relative;
`;

const Title = styled.div`
  ${Bold};
  color: ${colors.fg};
  font-size: ${tokens.fontSize1};
  background-color: ${colors.bg0};
  padding: ${tokens.size1} ${tokens.size2};
  position: absolute;
  left: ${tokens.size2};
  top: 0;
  transform: translateY(-50%);
`;

const Counter = styled.div`
  ${Bold};
  display: flex;
  align-items: center;
  gap: ${tokens.size2};
  color: ${colors.fg};
  font-size: ${tokens.fontSize1};
  background-color: ${colors.bg0};
  padding: ${tokens.size1} ${tokens.size2};
  position: absolute;
  right: ${tokens.size2};
  bottom: 0;
  transform: translateY(50%);
`;

type Props = {
  cards: Array<Card | null>;
  activeCards?: Array<Card | null>;
  onClickCard?: (card: Card) => void;
  count?: number;
  title: string;
};

export default function Area({
  activeCards,
  cards,
  onClickCard,
  title,
  count,
}: Props) {
  const isActive = (card: Card | null) => !!card && includes(activeCards, card);
  return (
    <Wrapper>
      <Title>{title}</Title>
      {cards.map((card, i) => (
        <CardUI
          card={card}
          onClick={() => onClickCard?.(card!)}
          key={!card ? `null${i}` : getKeyForCard(card)}
          isActive={isActive(card)}
        />
      ))}
      {typeof count === "number" && (
        <Counter>
          <LayersIcon size={tokens.size3} />
          {count}
        </Counter>
      )}
    </Wrapper>
  );
}
