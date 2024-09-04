import "./Popover.css";
import { useState } from "react";
import { FaCheck, FaCopy, FaRedo, FaVolumeUp } from "react-icons/fa";

interface PopoverTypes {
  onCopy: () => void;
  onRegenerate: () => void;
  onPlayAudio: () => void;
  showRegenerateButton: boolean;
}

export const Popover: React.FC<PopoverTypes> = ({
  onCopy,
  onRegenerate,
  onPlayAudio,
  showRegenerateButton,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };
  return (
    <div className="popoverContainer">
      <button
        className="popoverButton"
        onClick={handleCopy}
        title="Copy"
        disabled={copySuccess}
      >
        {copySuccess ? <FaCheck /> : <FaCopy />}
      </button>
      {showRegenerateButton && (
        <button
          className="popoverButton"
          onClick={onRegenerate}
          title="Regenerate"
        >
          <FaRedo />
        </button>
      )}
      <button
        className="popoverButton"
        onClick={onPlayAudio}
        title="Play Audio"
      >
        <FaVolumeUp />
      </button>
    </div>
  );
};
