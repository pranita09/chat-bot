import { GoogleGenerativeAI } from "@google/generative-ai";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";
import { Box, Paper, Typography, IconButton, TextField } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import { ChatMessage } from "./ChatMessage";

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
      return `${msg.text}`;
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
      {!visibleBot && (
        <Paper
          sx={{
            position: "fixed",
            top: "50%",
            left: "80%",
            transform: "translate(-50%, -50%)",
            width: "90vw",
            height: "80vh",
            maxWidth: 450,
            maxHeight: 600,
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: 2,
            padding: 2.5,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            "@media (max-width: 1024px)": {
              left: "70%",
            },
            "@media (max-width: 768px)": {
              left: "60%",
              width: "95vw",
              height: "70vh",
            },
            "@media (max-width: 480px)": {
              left: "50%",
              width: "80vw",
              height: "60vh",
            },
          }}
        >
          <Box
            sx={{
              position: "fixed",
              top: "10px",
              left: "20px",
              right: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 0.5,
              borderBottom: "1px solid #ddd",
              zIndex: 1001,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold", margin: 0 }}>
              Chat Interface
            </Typography>
            <IconButton onClick={() => setVisibleBot(!visibleBot)}>
              <CancelOutlinedIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>
          <Box
            ref={interfaceBodyRef}
            sx={{
              marginTop: 6,
              marginBottom: 6,
              overflowY: "auto",
              flexGrow: 1,
            }}
          >
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
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: "20px",
              left: "20px",
              right: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "white",
              zIndex: 1001,
              borderTop: "1px solid #ddd",
            }}
          >
            <TextField
              inputRef={inputRef}
              type="text"
              id="standard-multiline-static"
              multiline
              rows={1}
              defaultValue="Default Value"
              variant="standard"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              sx={{ width: "90%", fontSize: "14px" }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={isSending || !inputMessage.trim()}
              color="primary"
              sx={{ paddingRight: "0", paddingBottom: "0" }}
            >
              {" "}
              <TelegramIcon sx={{ fontSize: "2.5rem" }} />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};
