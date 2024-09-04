import "./App.css";
import logo from "./logo.svg";
import { useState } from "react";
import { ChatbotHandler } from "./components/ChatbotHandler";
import { ChatbotInterface } from "./components/ChatbotInterface";

function App() {
  const [visibleBot, setVisibleBot] = useState<boolean>(true);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <ChatbotInterface visibleBot={visibleBot} setVisibleBot={setVisibleBot} />
      <ChatbotHandler visibleBot={visibleBot} setVisibleBot={setVisibleBot} />
    </div>
  );
}

export default App;
