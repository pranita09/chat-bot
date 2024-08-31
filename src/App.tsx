import "./App.css";
import { useState } from "react";
import { ChatbotHandler } from "./components/ChatbotHandler/ChatbotHandler";

function App() {
  const [visibleBot, setVisibleBot] = useState<boolean>(true);
  return (
    <div className="App">
      <ChatbotHandler visibleBot={visibleBot} setVisibleBot={setVisibleBot} />
    </div>
  );
}

export default App;
