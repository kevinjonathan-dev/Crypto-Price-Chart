import React from "react";
import logo from "./logo.svg";
import PlaceholderChart from "./components/PlaceholderChart";
import "./App.css";

function App() {
  return (
    <div
      className="contentCenterCenter flexDirCol grabackground"
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          boxShadow: "15px 15px 15px rgba(0,0,0,0.5)",
          padding: "8%",
          paddingTop: "3%",
          minHeight: window.innerHeight > window.innerWidth ? "80vh" : "200px",
        }}
        className="grabient flex maxl contentCenterCenter white w80 vh65 flexDirCol braxl"
      >
        <PlaceholderChart />
      </div>
    </div>
  );
}

export default App;
