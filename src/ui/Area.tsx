import tokens from "open-props";
import styled from "styled-components";
import { includes } from "lodash";
import { LayersIcon } from "lucide-react";
import colors from "ui/styles/colors";
import { Bold } from "ui/styles/typography";
import type { Card } from "deck";
import getKeyForCard from "utils/getKeyForCard";
import type { buildCardUi } from "ui/buildCardUI";

const Wrapper = styled.div<{ $rowSize: number }>`
  border-radius: ${tokens.radius2};
  border: ${tokens.borderSize3} solid ${colors.bg2};
  display: grid;
  gap: ${tokens.sizeFluid2};
  grid-template-columns: ${p => `repeat(${p.$rowSize}, auto)`};
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
  activeCards?: Array<Card | null>;
  cards: Array<Card | null>;
  count?: number;
  onClickCard?: (card: Card) => void;
  rowSize?: number;
  title: string;
  CardUI: ReturnType<typeof buildCardUi>;
};

export default function Area({
  activeCards,
  cards,
  count,
  onClickCard,
  rowSize = 3,
  title,
  CardUI,
}: Props) {
  const isActive = (card: Card | null) => !!card && includes(activeCards, card);
  return (
    <Wrapper $rowSize={rowSize}>
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
