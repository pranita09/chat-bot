import { useState } from "react";
import { Box, Avatar, Typography, Paper } from "@mui/material";
import { Popover } from "./Popover";

interface ChatMessageType {
  sender: "bot" | "user";
  text: string;
  isTyping?: boolean;
  onRegenerate: () => void;
  showRegenerateButton: boolean;
  isLastBotMessage: boolean;
}

export const ChatMessage: React.FC<ChatMessageType> = ({
  sender,
  text,
  isTyping,
  onRegenerate,
  showRegenerateButton,
  isLastBotMessage,
}) => {
  const [showPopover, setShowPopover] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handlePlayAudio = () => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  return (
    <Box
      display="flex"
      justifyContent={sender === "bot" ? "flex-start" : "flex-start"}
      alignItems={sender === "bot" ? "flex-start" : "flex-end"}
      flexDirection={sender === "bot" ? "row" : "row-reverse"}
      marginY={3}
      marginBottom={isLastBotMessage ? 5 : 3}
      position="relative"
      onMouseEnter={() => sender === "bot" && setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
    >
      <Avatar
        sx={{
          bgcolor: "rgb(221, 225, 227)",
          margin: sender === "bot" ? "0 10px 0 0" : "0 0 0 10px",
          width: 40,
          height: 40,
          fontSize: 24,
        }}
      >
        {sender === "bot" ? "🤖" : "👤"}
      </Avatar>
      <Paper
        sx={{
          padding: "10px 15px",
          borderRadius:
            sender === "bot" ? "0 15px 15px 15px" : "15px 15px 0 15px",
          backgroundColor: sender === "bot" ? "#e1e1e1" : "#007bff",
          color: sender === "bot" ? "inherit" : "white",
          maxWidth: "70%",
          position: "relative",
        }}
      >
        <Typography variant="body2" align="left">
          {isTyping ? "..." : text}
        </Typography>
      </Paper>
      {sender === "bot" && (
        <Popover
          onCopy={handleCopy}
          onRegenerate={onRegenerate}
          onPlayAudio={handlePlayAudio}
          showRegenerateButton={showRegenerateButton}
          style={{ display: showPopover ? "flex" : "none" }}
        />
      )}
    </Box>
  );
};
