import "core-js/stable";
import "./style.css";
import * as React from "react";
import ReactDOM from "react-dom";
import {configure} from "mobx";
import App from "./containers/App";

(window as any).global = window;
configure({
    enforceActions: "never",
});

ReactDOM.render(<App/>, document.querySelector("#app"));
