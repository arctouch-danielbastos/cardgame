import tokens from "open-props";
import styled, { css } from "styled-components";
import colors from "ui/styles/colors";
import { Bold } from "ui/styles/typography";

const redColor = colors.red;
const blackColor = colors.blue;

export const BaseCard = styled.div<{ $isRed?: boolean }>`
  --cardColor: ${p => (p.$isRed ? redColor : blackColor)};

  ${Bold};
  align-items: center;
  position: relative;
  justify-content: center;
  aspect-ratio: ${tokens.ratioPortrait};
  background: ${colors.bg2};
  border-radius: ${tokens.radius3};
  display: flex;
  color: var(--cardColor);
  flex-direction: column;
  font-size: ${tokens.fontSize2};
  gap: ${tokens.size3};
  width: ${tokens.size10};
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &:hover {
    background-color: ${colors.bg3};
  }
`;

export const CardPlaceholder = styled(BaseCard)`
  background-color: ${colors.none};

  &:hover {
    background-color: ${colors.none};
  }
`;

export const PlayingCard = styled(BaseCard)<{ $isActive: boolean }>`
  ${p => p.$isActive && activeCard}
`;

export const activeCard = css`
  :after {
    background-color: var(--cardColor);
    bottom: 8px;
    content: "";
    height: 3px;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
    width: 10px;
  }
`;
