import scoundrelRoute from "scoundrel/route";
import area52Route from "area52/route";
import React from "react";
import ReactDOM from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import colors, { DarkColors, LightColors } from "ui/styles/colors";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";

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

const routes: RouteObject[] = [scoundrelRoute, area52Route];

const router = createBrowserRouter(routes, { basename: "/cardgame" });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStyle />
    <RouterProvider router={router} />
  </React.StrictMode>
);
