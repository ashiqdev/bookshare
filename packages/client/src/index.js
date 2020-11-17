import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import App from "./views/App";
import "./styles/index.css";

Modal.setAppElement("#root");

function Container() {
  return <App />;
}

if (module.hot) {
  module.hot.accept("./views/App", () => {
    ReactDOM.render(<Container />, document.querySelector("#root"));
  });
}

ReactDOM.render(<Container />, document.querySelector("#root"));
