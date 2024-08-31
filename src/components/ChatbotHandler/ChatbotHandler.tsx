import "./ChatbotHandler.css";
import React, { Dispatch, SetStateAction } from "react";
import { SiChatbot } from "react-icons/si";

interface ChatbotHandlerType {
  visibleBot: Boolean;
  setVisibleBot: Dispatch<SetStateAction<boolean>>;
}

export const ChatbotHandler: React.FC<ChatbotHandlerType> = ({
  visibleBot,
  setVisibleBot,
}) => {
  return (
    <>
      {visibleBot && (
        <button
          className="chatbotBtn"
          onClick={() => setVisibleBot(!visibleBot)}
        >
          <div>
            <SiChatbot />
          </div>
        </button>
      )}
    </>
  );
};
