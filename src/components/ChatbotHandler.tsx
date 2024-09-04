import React, { Dispatch, SetStateAction } from "react";
import { IconButton, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

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
        <IconButton
          onClick={() => setVisibleBot(!visibleBot)}
          sx={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            backgroundColor: "rgb(94, 240, 248)",
            maxHeight: "3rem",
            maxWidth: "3rem",
            padding: "2rem",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              cursor: "pointer",
              transform: "scale(1.02)",
              transition: "transform 0.3s ease",
              backgroundColor: "rgb(94, 240, 248)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ChatIcon sx={{ fontSize: "2rem", color: "black" }} />
          </Box>
        </IconButton>
      )}
    </>
  );
};
