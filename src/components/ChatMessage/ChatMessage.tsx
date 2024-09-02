import "./ChatMessage.css";

interface ChatMessageType {
  sender: "bot" | "user";
  text: string;
}

export const ChatMessage: React.FC<ChatMessageType> = ({ sender, text }) => {
  return (
    <div className={`chatMessage ${sender}`}>
      <div className="avatar">{sender === "bot" ? "🤖" : "👤"}</div>
      <div className="messageText">{text}</div>
    </div>
  );
};
