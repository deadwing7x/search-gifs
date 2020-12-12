import React from "react";
import "./App.css";
import DisplayGifs from "./components/DisplayGifs";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Search for Gifs:</h1>
          <div className="result-div">
            <DisplayGifs />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
