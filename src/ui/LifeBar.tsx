import tokens from "open-props";
import styled from "styled-components";
import colors from "ui/styles/colors";
import Heart from "scoundrel/heart.svg?react";
import { Bold } from "ui/styles/typography";
import { motion } from "framer-motion";

type Props = { max: number; health: number };

const RADIUS = tokens.radius3;

const Wrapper = styled(motion.div)`
  background-color: ${colors.bgBlue};
  border-radius: ${RADIUS};
  height: 0.5rem;
  position: relative;
`;

const Track = styled.div`
  background-color: ${colors.bgRed};
  border-radius: ${RADIUS};
  content: "";
  display: block;
  height: 100%;
  left: 0;
  width: calc(var(--percentage) * 1%);
`;

const Indicator = styled.div`
  ${Bold};
  align-items: center;
  color: ${colors.red};
  display: flex;
  flex-direction: column;
  gap: ${tokens.size1};
  position: absolute;
  top: -10px;
  z-index: 100;
  left: calc(var(--percentage) * 1% - 10px);
`;

export default function LifeBar({ max, health }: Props) {
  const percentage = Math.round((health / max) * 100);

  return (
    <Wrapper animate={{ "--percentage": percentage } as any}>
      <Track />
      <Indicator>
        <Heart />
        <span>{health}</span>
      </Indicator>
    </Wrapper>
  );
}
