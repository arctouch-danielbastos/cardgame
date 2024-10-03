import { isRed, type Card, type Suit } from "deck";
import type { ReactNode } from "react";
import { CardPlaceholder, PlayingCard } from "ui/styles/card";

const getRank = ({ rank }: Card) => {
  if (rank === 14) return "A";
  if (rank === 13) return "K";
  if (rank === 12) return "Q";
  if (rank === 11) return "J";
  if (rank === 1) return "A";
  return rank;
};

type Props = {
  onClick?: (card: Card) => void;
  card: Card | null;
  isActive?: boolean;
};

export type SuitIconMap = { [suit in Suit]: ReactNode };
export const buildCardUi = (suitIconMap: SuitIconMap) => {
  return function CardUI({ card, isActive = false, onClick }: Props) {
    if (!card) return <CardPlaceholder />;

    const icon = suitIconMap[card.suit] || null;
    return (
      <PlayingCard
        $isActive={isActive}
        onClick={() => onClick?.(card)}
        $isRed={isRed(card)}
      >
        <div>{getRank(card)}</div>
        {icon}
      </PlayingCard>
    );
  };
};
