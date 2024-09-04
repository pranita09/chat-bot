import "./Popover.css";
import { FaCopy, FaRedo, FaVolumeUp } from "react-icons/fa";

interface PopoverTypes {
  onCopy: () => void;
  onRegenerate: () => void;
  onPlayAudio: () => void;
}

export const Popover: React.FC<PopoverTypes> = ({
  onCopy,
  onRegenerate,
  onPlayAudio,
}) => {
  return (
    <div className="popoverContainer">
      <button className="popoverButton" onClick={onCopy} title="Copy">
        <FaCopy />
      </button>
      <button
        className="popoverButton"
        onClick={onRegenerate}
        title="Regenerate"
      >
        <FaRedo />
      </button>
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
