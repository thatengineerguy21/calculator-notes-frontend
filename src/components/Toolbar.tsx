import React from 'react';
import { useDrawing } from '../contexts/DrawingContext';
import Pen from './Pen';
import Eraser from './Eraser';
import ColorPicker from './ColorPicker';
import SizeSlider from './SizeSlider';

const Toolbar: React.FC = () => {
  const { 
    currentTool, 
    setCurrentTool, 
    penColor, 
    setPenColor, 
    penSize, 
    setPenSize,
    eraserSize,
    setEraserSize
  } = useDrawing();

  const handlePenClick = () => {
    setCurrentTool(currentTool === 'pen' ? 'none' : 'pen');
  };

  const handleEraserClick = () => {
    setCurrentTool(currentTool === 'eraser' ? 'none' : 'eraser');
  };

  return (
    <div className="flex items-center space-x-4 p-2 border-b">
      <Pen isActive={currentTool === 'pen'} onClick={handlePenClick} />
      <Eraser isActive={currentTool === 'eraser'} onClick={handleEraserClick} />
      
      {currentTool === 'pen' && (
        <>
          <ColorPicker color={penColor} onChange={setPenColor} />
          <SizeSlider 
            value={penSize} 
            onChange={setPenSize} 
            min={1} 
            max={20} 
            label="Pen Size" 
          />
        </>
      )}
      
      {currentTool === 'eraser' && (
        <SizeSlider 
          value={eraserSize} 
          onChange={setEraserSize} 
          min={5} 
          max={50} 
          label="Eraser Size" 
        />
      )}
    </div>
  );
};

export default Toolbar;