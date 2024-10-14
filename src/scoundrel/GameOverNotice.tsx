import { PartyPopperIcon, SkullIcon } from "lucide-react";
import { useMemo, type ComponentProps } from "react";
import { useGame } from "scoundrel/context";
import Snackbar from "ui/Snackbar";

type Config = ComponentProps<typeof Snackbar>["alert"];

const won: Config = {
  icon: <PartyPopperIcon />,
  text: "You won!",
  variant: "happy",
};

const lost: Config = {
  icon: <SkullIcon />,
  text: "You lost",
  variant: "danger",
};

export default function GameOverNotice() {
  const { state } = useGame();

  const alert = useMemo(() => {
    if (state.winState === "lost") return lost;
    if (state.winState === "won") return won;
    return null;
  }, [state]);

  return <Snackbar alert={alert} />;
}
