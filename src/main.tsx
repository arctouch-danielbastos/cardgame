import App from "scoundrel/view";
import scoundrelModel from "scoundrel/model";
import React from "react";
import ReactDOM from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import colors, { DarkColors, LightColors } from "ui/styles/colors";
import { GameProvider } from "scoundrel/context";

const GlobalStyle = createGlobalStyle`
	:root {
		${LightColors};

		@media (prefers-color-scheme: dark) {
			${DarkColors};
		}
	}

  body,
  html {
    background-color: ${colors.bg0};
  }
  
  #root {
    display: flex;
    justify-content: center;
  }
`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStyle />
    <GameProvider game={scoundrelModel()}>
      <App />
    </GameProvider>
  </React.StrictMode>
);
