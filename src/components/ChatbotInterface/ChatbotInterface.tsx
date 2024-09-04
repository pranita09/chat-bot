import "./ChatbotInterface.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MdOutlineCancel } from "react-icons/md";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";
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
    { sender: "bot" | "user"; text: string; isTyping?: boolean }[]
  >([{ sender: "bot", text: "Hi, how can I help you?" }]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const interfaceBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const constructContext = (maxContextLength: number = 5) => {
    const contextMessages = messages.slice(-maxContextLength).map((msg) => {
      return ` ${msg.text}`;
    });
    return contextMessages.join("\n");
  };

  const getResponse = async (userMessage: string, index?: number) => {
    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyC5aIkJThuVWoob7Sow1HS1xmkDOgRGrzw"
      );
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-001",
        generationConfig: {
          maxOutputTokens: 150,
        },
      });

      const context = constructContext();

      const result = await model.generateContent(
        `${context}\nUser: ${userMessage}`
      );
      const botResponse = result.response.text();
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        if (index !== undefined) {
          updatedMessages[index] = { sender: "bot", text: botResponse };
        } else {
          updatedMessages[updatedMessages.length - 1] = {
            sender: "bot",
            text: botResponse,
          };
        }

        return updatedMessages;
      });
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          sender: "bot",
          text: "Sorry, there was an error getting a response. Please try again.",
        };
        return updatedMessages;
      });
    } finally {
      setIsSending(false);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages([...messages, { sender: "user", text: inputMessage }]);
    setInputMessage("");
    setIsSending(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: "", isTyping: true },
    ]);

    getResponse(inputMessage);
  };

  const handleRegenerate = (index: number) => {
    const userMessage = messages[index - 1].text;
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[index] = { sender: "bot", text: "", isTyping: true };
      return updatedMessages;
    });
    getResponse(userMessage, index);
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

  useEffect(() => {
    if (!isSending && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visibleBot, isSending]);

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
              <ChatMessage
                key={index}
                sender={msg.sender}
                text={msg.text}
                isTyping={msg.isTyping}
                onRegenerate={() => handleRegenerate(index)}
                showRegenerateButton={index !== 0}
              />
            ))}
          </div>
          <div className="inputContainer">
            <input
              ref={inputRef}
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
