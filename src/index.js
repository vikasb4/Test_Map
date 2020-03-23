import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Map from "./Map";

ReactDOM.render(
  <Map
    //google={this.props.google}
    center={{ lat: 43.6532, lng: -79.3832 }}
    height="300px"
    zoom={15}
  />,
  document.getElementById("root")
);
