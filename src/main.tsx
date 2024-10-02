import colors, { DarkColors, LightColors } from "area52/styles/color";
import App from "area52/ui";
import React from "react";
import ReactDOM from "react-dom/client";
import { createGlobalStyle } from "styled-components";

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
    <App />
  </React.StrictMode>
);
