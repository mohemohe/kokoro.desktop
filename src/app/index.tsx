import "core-js/stable";
import "./style.css";
import * as React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";

(window as any).global = window;

ReactDOM.render(<App/>, document.querySelector("#app"));
