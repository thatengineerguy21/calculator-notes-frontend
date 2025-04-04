import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';

/**
 * Available drawing tools
 * - pen: For drawing with color
 * - eraser: For erasing content
 * - none: No active tool
 */
type Tool = 'pen' | 'eraser' | 'none';

/**
 * Type for storing canvas state in history
 * ImageData represents the pixel data of a canvas area
 */
type HistoryState = ImageData;

/**
 * Interface defining all properties and methods available in the DrawingContext
 */
interface DrawingContextType {
  currentTool: Tool;                              // Currently selected tool
  setCurrentTool: (tool: Tool) => void;           // Function to change the current tool
  penColor: string;                               // Current pen color (hex)
  setPenColor: (color: string) => void;           // Function to change pen color
  penSize: number;                                // Current pen stroke width
  setPenSize: (size: number) => void;             // Function to change pen size
  eraserSize: number;                             // Current eraser size
  setEraserSize: (size: number) => void;          // Function to change eraser size
  history: HistoryState[];                        // Array of canvas states for undo/redo
  historyIndex: number;                           // Current position in history array
  saveToHistory: (canvas: HTMLCanvasElement) => void;  // Save current canvas state to history
  handleUndo: (canvas: HTMLCanvasElement) => void;     // Undo to previous state
  handleRedo: (canvas: HTMLCanvasElement) => void;     // Redo to next state
  handleReset: (canvas: HTMLCanvasElement) => void;    // Reset canvas to blank state
}

/**
 * Create the context with undefined default value
 * The actual value will be provided by DrawingProvider
 */
const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

/**
 * Custom hook to use the DrawingContext
 * Throws an error if used outside of a DrawingProvider
 * 
 * @returns {DrawingContextType} The drawing context value
 */
export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};

/**
 * DrawingProvider Component
 * 
 * Provides drawing state and functions to all child components
 * Manages tool selection, colors, sizes, and drawing history
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {JSX.Element} - Provider component
 */
export const DrawingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state for drawing tools and properties
  const [currentTool, setCurrentTool] = useState<Tool>('pen');
  const [penColor, setPenColor] = useState<string>('#000000');
  const [penSize, setPenSize] = useState<number>(2);
  const [eraserSize, setEraserSize] = useState<number>(20);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Add a constant for maximum history length
  const MAX_HISTORY_LENGTH = 20;

  /**
   * Save current canvas state to history
   * 
   * @param {HTMLCanvasElement} canvas - The canvas element to save
   */
  const saveToHistory = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    if (!context) return;

    try {
      // Get current canvas state
      const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // If we're not at the end of the history, remove future states
      if (historyIndex < history.length - 1) {
        setHistory(history.slice(0, historyIndex + 1));
      }
      
      // Create new history array with current state
      const newHistory = [...history.slice(0, historyIndex + 1), currentState];
      
      // If history is too long, remove oldest entries
      if (newHistory.length > MAX_HISTORY_LENGTH) {
        newHistory.shift(); // Remove oldest entry
      }
      
      // Update history and index
      setHistory(newHistory);
      setHistoryIndex(Math.min(historyIndex + 1, MAX_HISTORY_LENGTH - 1));
    } catch (error) {
      console.error("Error saving canvas state:", error);
      // Continue without saving history if there's an error
    }
  };

  /**
   * Handle undo operation - go back one step in history
   * 
   * @param {HTMLCanvasElement} canvas - The canvas element to update
   */
  const handleUndo = (canvas: HTMLCanvasElement) => {
    if (historyIndex <= 0) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Go back one step in history
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    
    // Apply the previous state
    context.putImageData(history[newIndex], 0, 0);
  };

  /**
   * Handle redo operation - go forward one step in history
   * 
   * @param {HTMLCanvasElement} canvas - The canvas element to update
   */
  const handleRedo = (canvas: HTMLCanvasElement) => {
    if (historyIndex >= history.length - 1) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Go forward one step in history
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    
    // Apply the next state
    context.putImageData(history[newIndex], 0, 0);
  };

  /**
   * Handle reset operation - clear canvas and save to history
   * 
   * @param {HTMLCanvasElement} canvas - The canvas element to reset
   */
  const handleReset = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear canvas
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save the cleared state to history
    saveToHistory(canvas);
  };

  return (
    <DrawingContext.Provider
      value={{
        currentTool,
        setCurrentTool,
        penColor,
        setPenColor,
        penSize,
        setPenSize,
        eraserSize,
        setEraserSize,
        history,
        historyIndex,
        saveToHistory,
        handleUndo,
        handleRedo,
        handleReset
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export default DrawingContext;