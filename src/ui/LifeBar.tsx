import tokens from "open-props";
import styled from "styled-components";
import colors from "ui/styles/colors";
import Heart from "scoundrel/heart.svg?react";
import { Bold } from "ui/styles/typography";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type Transition,
} from "framer-motion";
import { useEffect } from "react";

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
  const healthValue = useMotionValue(health);
  const rounded = useTransform(healthValue, value => Math.round(value));
  useEffect(() => {
    const control = animate(healthValue, health);
    return () => control.stop();
  }, [health]);

  return (
    <Wrapper animate={{ "--percentage": percentage } as any}>
      <Track />
      <Indicator>
        <Heart />
        <motion.span>{rounded}</motion.span>
      </Indicator>
    </Wrapper>
  );
}
