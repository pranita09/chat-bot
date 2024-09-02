import "./ChatbotInterface.css";
import { MdOutlineCancel } from "react-icons/md";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";
import { botResponses } from "../../data";
import { ChatMessage } from "../ChatMessage/ChatMessage";

interface ChatbotInterfaceType {
  visibleBot: Boolean;
  setVisibleBot: Dispatch<SetStateAction<boolean>>;
}

export const ChatbotInterface: React.FC<ChatbotInterfaceType> = ({
  visibleBot,
  setVisibleBot,
}) => {
  const [messages, setMessages] = useState<
    { sender: "bot" | "user"; text: string }[]
  >([{ sender: "bot", text: "Hi, how can I help you?" }]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const interfaceBodyRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages([...messages, { sender: "user", text: inputMessage }]);
    setInputMessage("");
    setIsSending(true);

    setTimeout(() => {
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: randomResponse },
      ]);
      setIsSending(false);
    }, 2000);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isSending && inputMessage.trim()) {
      sendMessage();
    }
  };

  useEffect(() => {
    if (interfaceBodyRef.current) {
      interfaceBodyRef.current.scrollTop =
        interfaceBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {visibleBot === false && (
        <div className="interfaceContainer">
          <div className="interfaceHeader">
            <p className="headerTitle">Chat Interface</p>
            <button
              className="cancelButton"
              onClick={() => setVisibleBot(!visibleBot)}
            >
              <MdOutlineCancel />
            </button>
          </div>
          <div className="interfaceBody" ref={interfaceBodyRef}>
            {messages.map((msg, index) => (
              <ChatMessage key={index} sender={msg.sender} text={msg.text} />
            ))}
          </div>
          <div className="inputContainer">
            <input
              type="text"
              className="textInput"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isSending}
            />
            <button
              className="sendButton"
              onClick={sendMessage}
              disabled={isSending || !inputMessage.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};
