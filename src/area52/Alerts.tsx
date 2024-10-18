import { useGame } from "area52/context";
import {
  AlertOctagonIcon,
  CrosshairIcon,
  PartyPopperIcon,
  ShieldXIcon,
  SkullIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import Snackbar from "ui/Snackbar";

type Config = ComponentProps<typeof Snackbar>["alert"] & {
  permanent?: boolean;
};
const firstWave: Config = {
  icon: <CrosshairIcon />,
  text: "1st wave",
  variant: "neutral",
};

const secondWave: Config = {
  icon: <AlertOctagonIcon />,
  text: "2nd wave",
  variant: "neutral",
};

const winning: Config = {
  icon: <PartyPopperIcon />,
  text: "You won!",
  variant: "happy",
  permanent: true,
};

const lost: Config = {
  icon: <SkullIcon />,
  text: "You lost",
  variant: "danger",
  permanent: true,
};

const buildError = (text: string): Config => ({
  text,
  icon: <ShieldXIcon />,
  variant: "danger",
});

const CLEAR_ALERT_TIMEOUT = 1500;
export default function Alerts() {
  const { state, error } = useGame();

  const [alert, setAlert] = useState<Config | null>();
  const [lastWaveShown, setLastWaveShown] = useState<number | null>();

  const clearAlert = useRef(() =>
    setTimeout(() => setAlert(null), CLEAR_ALERT_TIMEOUT)
  ).current;

  useEffect(() => {
    if (error) setAlert(buildError(error.message));
    if (state.winState === "won") setAlert(winning);
    if (state.winState === "lost") setAlert(lost);
    if (!state.is2nWave && lastWaveShown !== 1) {
      setAlert(firstWave);
      setLastWaveShown(1);
      clearAlert();
    }
    if (state.is2nWave && lastWaveShown !== 2) {
      setAlert(secondWave);
      setLastWaveShown(2);
      clearAlert();
    }
  }, [clearAlert, error, lastWaveShown, state.is2nWave, state.winState]);

  return <Snackbar alert={alert} />;
}
