import React from 'react';
import { Button } from './ui/button';
import { Eraser as EraserIcon } from 'lucide-react';

interface EraserProps {
  isActive: boolean;
  onClick: () => void;
}

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