import { ufo, faceAlien, astronautHelmet } from "@lucide/lab";
import { Icon, Rocket } from "lucide-react";
import type { Card } from "area52/deck/types";
import { isRed } from "area52/model/deck";
import { CardPlaceholder, PlayingCard } from "area52/styles/card";

const suitToComponent = {
  heart: <Icon iconNode={ufo} />,
  diamond: <Icon iconNode={faceAlien} />,
  spade: <Icon iconNode={astronautHelmet} />,
  club: <Rocket />,
};

const getRank = ({ rank }: Card) => {
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

export default function CardUI({ card, isActive = false, onClick }: Props) {
  if (!card) return <CardPlaceholder />;

  const icon = suitToComponent[card.suit] || null;
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
}
