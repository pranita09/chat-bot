import "./ChatMessage.css";
import { useState } from "react";
import { Popover } from "../Popover/Popover";

interface ChatMessageType {
  sender: "bot" | "user";
  text: string;
  isTyping?: Boolean;
  onRegenerate: () => void;
}

export const ChatMessage: React.FC<ChatMessageType> = ({
  sender,
  text,
  isTyping,
  onRegenerate,
}) => {
  const [showPopover, setShowPopover] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handlePlayAudio = () => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div
      className={`chatMessage ${sender}`}
      onMouseEnter={() => sender === "bot" && setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
    >
      <div className="avatar">{sender === "bot" ? "🤖" : "👤"}</div>
      <div className="messageText">{isTyping ? "..." : text}</div>
      {sender === "bot" && showPopover && (
        <Popover
          onCopy={handleCopy}
          onRegenerate={onRegenerate}
          onPlayAudio={handlePlayAudio}
        />
      )}
    </div>
  );
};
