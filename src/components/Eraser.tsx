import React from 'react';
import { Button } from './ui/button';
import { Eraser as EraserIcon } from 'lucide-react';

/**
 * Props interface for the Eraser component
 * @property {boolean} isActive - Whether the eraser tool is currently active
 * @property {function} onClick - Callback function when eraser button is clicked
 */
interface EraserProps {
  isActive: boolean;
  onClick: () => void;
}

/**
 * Eraser Component
 * 
 * Button for toggling the eraser tool
 * Changes appearance when active
 * 
 * @param {EraserProps} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const Eraser: React.FC<EraserProps> = ({ isActive, onClick }) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      onClick={onClick}
      className={`${isActive ? 'bg-primary text-primary-foreground' : ''}`}
      title="Eraser"
    >
      <EraserIcon className="h-5 w-5" />
    </Button>
  );
};

export default Eraser;