import React from 'react';
import { Eraser, Undo, Redo } from 'lucide-react';
import { useDrawing } from '../contexts/DrawingContext';
import ColorPicker from './ColorPicker';

/**
 * Toolbar Component
 * 
 * Main toolbar for the drawing application
 * Contains buttons for reset, undo/redo, color selection, eraser, and run
 * 
 * @returns {JSX.Element} - Rendered component
 */
const Toolbar: React.FC = () => {
  // Get drawing context values and functions
  const { 
    currentTool, 
    setCurrentTool, 
    history,
    historyIndex,
    handleUndo,
    handleRedo,
    handleReset
  } = useDrawing();

  // Reference to the canvas element (found via DOM query)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  /**
   * Find the canvas element in the DOM
   * This is needed because the canvas is in a different component
   */
  React.useEffect(() => {
    canvasRef.current = document.querySelector('canvas');
  }, []);

  /**
   * Handle undo button click
   * Passes the canvas element to the context's handleUndo function
   */
  const onUndo = () => {
    if (canvasRef.current) handleUndo(canvasRef.current);
  };

  /**
   * Handle redo button click
   * Passes the canvas element to the context's handleRedo function
   */
  const onRedo = () => {
    if (canvasRef.current) handleRedo(canvasRef.current);
  };

  /**
   * Handle reset button click
   * Passes the canvas element to the context's handleReset function
   */
  const onReset = () => {
    if (canvasRef.current) handleReset(canvasRef.current);
  };

  /**
   * Handle run button click
   * Currently just logs to console, will be implemented later
   */
  const onRun = () => {
    console.log('Run clicked');
  };

  return (
    <div className="flex justify-between items-center p-2 bg-black text-white">
      <div className="flex items-center space-x-2">
        <button 
          className="px-4 py-2"
          onClick={onReset}
        >
          Reset
        </button>
        
        {/* Undo/Redo buttons */}
        <button 
          className="p-2 rounded hover:bg-gray-700 disabled:opacity-50"
          onClick={onUndo}
          disabled={historyIndex <= 0}
          title="Undo"
        >
          <Undo size={18} />
        </button>
        
        <button 
          className="p-2 rounded hover:bg-gray-700 disabled:opacity-50"
          onClick={onRedo}
          disabled={historyIndex >= history.length - 1}
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>
      
      {/* Color buttons */}
      <ColorPicker />
      
      {/* Eraser button */}
      <button 
        className={`px-4 py-2 flex items-center gap-2 ${currentTool === 'eraser' ? 'bg-gray-700' : ''}`}
        onClick={() => setCurrentTool(currentTool === 'eraser' ? 'pen' : 'eraser')}
      >
        <Eraser size={18} />
        Eraser
      </button>
      
      <button 
        className="px-4 py-2"
        onClick={onRun}
      >
        Run
      </button>
    </div>
  );
};

export default Toolbar;