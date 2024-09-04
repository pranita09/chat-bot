import { useState } from "react";
import { IconButton, Paper } from "@mui/material";
import { Check, ContentCopy, Replay, VolumeUp } from "@mui/icons-material";

interface PopoverTypes {
  onCopy: () => void;
  onRegenerate: () => void;
  onPlayAudio: () => void;
  showRegenerateButton: boolean;
  style?: React.CSSProperties;
}

export const Popover: React.FC<PopoverTypes> = ({
  onCopy,
  onRegenerate,
  onPlayAudio,
  showRegenerateButton,
  style,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };
  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        top: "100%",
        left: "12%",
        zIndex: 10,
        display: "flex",
        ...style,
      }}
    >
      <IconButton onClick={handleCopy} title="Copy" disabled={copySuccess}>
        {copySuccess ? (
          <Check sx={{ fontSize: "1rem", color: "green" }} />
        ) : (
          <ContentCopy sx={{ fontSize: "1rem" }} />
        )}
      </IconButton>
      {showRegenerateButton && (
        <IconButton onClick={onRegenerate} title="Regenerate">
          <Replay sx={{ fontSize: "1rem" }} />
        </IconButton>
      )}
      <IconButton onClick={onPlayAudio} title="Play Audio">
        <VolumeUp sx={{ fontSize: "1rem" }} />
      </IconButton>
    </Paper>
  );
};
