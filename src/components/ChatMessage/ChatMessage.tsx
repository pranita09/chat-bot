import "./ChatMessage.css";

interface ChatMessageType {
  sender: "bot" | "user";
  text: string;
  isTyping?: Boolean;
}

export const ChatMessage: React.FC<ChatMessageType> = ({
  sender,
  text,
  isTyping,
}) => {
  return (
    <div className={`chatMessage ${sender}`}>
      <div className="avatar">{sender === "bot" ? "🤖" : "👤"}</div>
      <div className="messageText">{isTyping ? "..." : text}</div>
    </div>
  );
};
