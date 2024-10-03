import tokens from "open-props";
import styled, { css } from "styled-components";
import { onMobile } from "ui/styles/breakpoints";
import colors from "ui/styles/colors";
import { Bold } from "ui/styles/typography";

const DisabledAction = css`
  cursor: default;
  pointer-events: none;
  opacity: 0.5;
`;

export default styled.button<{ disabled?: boolean }>`
  ${Bold};
  background-color: ${colors.bg2};
  border-radius: ${tokens.radius2};
  border: ${tokens.borderSize3} solid ${colors.none};
  color: ${colors.fg};
  cursor: pointer;
  font-size: ${tokens.fontSize2};
  letter-spacing: ${tokens.fontLetterspacing1};
  outline: none;
  padding: ${tokens.size2} ${tokens.size5};
  ${p => (p.disabled ? DisabledAction : null)}

  ${onMobile} {
    font-size: ${tokens.fontSize3};
  }

  &:hover {
    background-color: ${colors.bg3};
  }
`;
