import React, { useRef, useEffect, useState } from 'react';
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
  
  // Track if canvas has been initialized
  const [isInitialized, setIsInitialized] = useState(false);
  
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

    // Store the current canvas state
    let canvasState: ImageData | null = null;

    /**
     * Resize canvas to match parent container dimensions
     * with maximum limits to prevent memory issues
     */
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      // Calculate dimensions while respecting maximums
      const width = Math.min(container.clientWidth, MAX_CANVAS_WIDTH);
      const height = Math.min(container.clientHeight, MAX_CANVAS_HEIGHT);
      
      // Save current canvas state if it exists
      if (canvas.width > 0 && canvas.height > 0) {
        try {
          canvasState = context.getImageData(0, 0, canvas.width, canvas.height);
        } catch (e) {
          console.error("Failed to save canvas state during resize:", e);
        }
      }
      
      // Only resize if dimensions have changed
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        
        // Fill with white background
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Restore previous drawing if available
        if (canvasState) {
          try {
            // Draw at the center or top-left depending on size changes
            context.putImageData(canvasState, 0, 0);
          } catch (e) {
            console.error("Failed to restore canvas state after resize:", e);
          }
        }
      }
    };

    // Initial setup only once
    if (!isInitialized) {
      // Initial resize
      resizeCanvas();
      
      // Fill canvas with white background
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Save initial state to history
      try {
        saveToHistory(canvas);
      } catch (error) {
        console.error("Error in initial history save:", error);
      }
      
      setIsInitialized(true);
    }
    
    // Listen for window resize events
    window.addEventListener('resize', resizeCanvas);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [saveToHistory, isInitialized]);

  // Rest of the component remains unchanged
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

  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      
      // Save the state after drawing is complete
      const canvas = canvasRef.current;
      if (canvas) {
        try {
          saveToHistory(canvas);
        } catch (error) {
          console.error("Error saving to history after drawing:", error);
        }
      }
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