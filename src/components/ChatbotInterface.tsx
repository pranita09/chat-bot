import { GoogleGenerativeAI } from "@google/generative-ai";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  ChangeEvent,
} from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TelegramIcon from "@mui/icons-material/Telegram";
import AttachFileIcon from "@mui/icons-material/AttachFile";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUri, setUploadedFileUri] = useState<string | null>(null);

  const handlePinClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    // if (file) {
    //   setUploadedFile(file);
    //   console.log("File uploaded:", file);

    //   try {
    //     // Convert the file to a Base64 string
    //     const base64 = await fileToBase64(file);
    //     setUploadedFileUri(base64);
    //     console.log(`File Base64 URI: ${base64}`);
    //   } catch (error) {
    //     console.error("Error converting file to Base64:", error);
    //   }
    // }
    handleClose();
  };

  // Function to convert a file to a Base64 string
  // const fileToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result as string);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file);
  //   });
  // };

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
      const promptData = uploadedFileUri
        ? [
            {
              fileData: {
                mimeType: uploadedFile?.type || "text/plain",
                fileUri: uploadedFileUri,
              },
            },
            { text: `${userMessage}\n${context}` },
          ]
        : [{ text: `${userMessage}\n${context}` }];

      const result = await model.generateContent(promptData);
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

      setUploadedFile(null);
      setUploadedFileUri(null);
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
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userMessage },
      { sender: "bot", text: "", isTyping: true },
    ]);
    getResponse(userMessage);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isSending && inputMessage.trim()) {
      sendMessage();
    }
  };

  const lastBotMessageIndex = messages
    .map((msg, index) => (msg.sender === "bot" ? index : -1))
    .filter((index) => index !== -1)
    .pop();

  useEffect(() => {
    if (interfaceBodyRef.current) {
      interfaceBodyRef.current.scrollTop =
        interfaceBodyRef.current.scrollHeight;
    }
  }, [messages, visibleBot]);

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
              <CloseIcon sx={{ color: "black" }} />
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
                isLastBotMessage={index === lastBotMessageIndex}
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
            <Badge
              color="secondary"
              variant="dot"
              invisible={!uploadedFile}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <IconButton
                onClick={handlePinClick}
                sx={{ marginRight: "0.25rem" }}
              >
                <AttachFileIcon sx={{ fontSize: "1.25rem" }} />
              </IconButton>
            </Badge>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <MenuItem>
                <label
                  htmlFor="image-upload"
                  style={{ cursor: "pointer", fontSize: "12px" }}
                >
                  Attach Image
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </label>
              </MenuItem>
              <MenuItem>
                <label
                  htmlFor="pdf-upload"
                  style={{ cursor: "pointer", fontSize: "12px" }}
                >
                  Attach PDF File
                  <input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </label>
              </MenuItem>
              <MenuItem>
                <label
                  htmlFor="video-upload"
                  style={{ cursor: "pointer", fontSize: "12px" }}
                >
                  Attach Video
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </label>
              </MenuItem>
              <MenuItem>
                <label
                  htmlFor="audio-upload"
                  style={{ cursor: "pointer", fontSize: "12px" }}
                >
                  Attach Audio
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </label>
              </MenuItem>
            </Menu>
            <TextField
              inputRef={inputRef}
              id="standard-multiline-static"
              multiline
              maxRows={3}
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
              disableRipple={true}
              color="primary"
              sx={{ paddingRight: "0", paddingBottom: "0" }}
            >
              {" "}
              <TelegramIcon sx={{ fontSize: "2rem" }} />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};
