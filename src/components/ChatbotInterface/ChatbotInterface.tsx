import "./ChatbotInterface.css";
import { MdOutlineCancel } from "react-icons/md";
import React, { Dispatch, SetStateAction } from "react";

interface ChatbotInterfaceType {
  visibleBot: Boolean;
  setVisibleBot: Dispatch<SetStateAction<boolean>>;
}
export const ChatbotInterface: React.FC<ChatbotInterfaceType> = ({
  visibleBot,
  setVisibleBot,
}) => {
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
          <div className="interfaceBody">
            <p>Chat No.1</p>
            <p>Chat No.2</p>
          </div>
          <div className="inputContainer">
            <input
              type="text"
              className="textInput"
              placeholder="Type your message..."
            />
            <button className="sendButton">Send</button>
          </div>
        </div>
      )}
    </>
  );
};
