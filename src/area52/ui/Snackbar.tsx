import styled, { css } from "styled-components";
import tokens from "open-props";
import color from "area52/styles/color";
import { Bold } from "area52/styles/typography";
import { AnimatePresence, motion } from "framer-motion";

const Danger = css`
  background-color: ${color.red};
  color: ${color.bgRed};
`;

const Happy = css`
  background-color: ${color.blue};
  color: ${color.bgBlue};
`;

const Neutral = css`
  background-color: ${color.fg};
  color: ${color.bg0};
`;

type Variant = "neutral" | "happy" | "danger";

const Wrapper = styled.div`
  bottom: ${tokens.size7};
  left: 0;
  position: fixed;
  right: 0;
  padding-bottom: ${tokens.size7};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Alert = styled(motion.div)<{ variant: Variant }>`
  ${Bold};
  border-radius: ${tokens.radius4};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.size2};
  padding: ${tokens.size3} 0;
  min-width: 12.5rem;

  ${p => p.variant === "neutral" && Neutral}
  ${p => p.variant === "danger" && Danger}
	${p => p.variant === "happy" && Happy}
`;

type Props = {
  alert?: {
    icon: React.ReactNode;
    text: string;
    variant?: Variant;
  } | null;
};

export default function Snackbar({ alert }: Props) {
  return (
    <Wrapper>
      <AnimatePresence>
        {alert && (
          <Alert
            variant={alert.variant ?? "neutral"}
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {alert.icon} <span>{alert.text}</span>
          </Alert>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
