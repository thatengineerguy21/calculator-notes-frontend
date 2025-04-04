import React, { useRef, useEffect } from 'react';
import { useDrawing } from '../contexts/DrawingContext';

/**
 * Canvas Component
 * 
 * The main drawing surface for the application
 * Handles all drawing operations and mouse interactions
 * 
 * @returns {JSX.Element} - Rendered component
 */
// Maximum canvas dimensions to prevent memory issues
const MAX_CANVAS_WIDTH = 2000;
const MAX_CANVAS_HEIGHT = 1500;

const Canvas: React.FC = () => {
  // Reference to the canvas DOM element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track drawing state with a ref to avoid re-renders during drawing
  const isDrawing = useRef(false);
  
  // Get drawing context values and functions
  const { 
    currentTool, 
    penColor, 
    penSize, 
    eraserSize,
    saveToHistory
  } = useDrawing();

  /**
   * Initialize canvas and set up event listeners
   * This runs once when the component mounts
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    /**
     * Resize canvas to match parent container dimensions
     * with maximum limits to prevent memory issues
     */
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        // Calculate dimensions while respecting maximums
        const width = Math.min(container.clientWidth, MAX_CANVAS_WIDTH);
        const height = Math.min(container.clientHeight, MAX_CANVAS_HEIGHT);
        
        // Only resize if dimensions have changed
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          
          // Refill with white background after resize
          context.fillStyle = '#FFFFFF';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    // Initial resize
    resizeCanvas();
    
    // Listen for window resize events
    window.addEventListener('resize', resizeCanvas);

    // Fill canvas with white background
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state to history
    try {
      if (canvas) saveToHistory(canvas);
    } catch (error) {
      console.error("Error in initial history save:", error);
    }

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [saveToHistory]);

  /**
   * Handle mouse down event to start drawing
   * 
   * @param {React.MouseEvent<HTMLCanvasElement>} e - Mouse event
   */
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'none') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    isDrawing.current = true;
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Start a new path at the mouse position
    context.beginPath();
    context.moveTo(x, y);
    
    // Configure context based on selected tool
    if (currentTool === 'pen') {
      // Normal drawing mode
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = penColor;
      context.lineWidth = penSize;
    } else if (currentTool === 'eraser') {
      // Eraser mode - uses destination-out to make pixels transparent
      context.globalCompositeOperation = 'destination-out';
      context.strokeStyle = 'rgba(0,0,0,1)';
      context.lineWidth = eraserSize;
    }
    
    // Set line style for smoother drawing
    context.lineCap = 'round';
    context.lineJoin = 'round';
  };

  /**
   * Handle mouse move event to continue drawing
   * 
   * @param {React.MouseEvent<HTMLCanvasElement>} e - Mouse event
   */
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || currentTool === 'none') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Draw line to current mouse position
    context.lineTo(x, y);
    context.stroke();
  };

  /**
   * Handle mouse up and mouse leave events to stop drawing
   * Saves the current state to history for undo/redo
   */
  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      
      // Save the state after drawing is complete
      const canvas = canvasRef.current;
      if (canvas) saveToHistory(canvas);
    }
  };

  return (
    <div className="flex-1 bg-gray-100 relative">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Canvas;