import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import muiTheme from "./theme/muiTheme";

ReactDOM.render(
  <MuiThemeProvider theme={muiTheme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById("root")
);
