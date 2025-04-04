import React, { createContext, useState, useContext, ReactNode } from 'react';

type Tool = 'pen' | 'eraser' | 'none';

interface DrawingContextType {
  currentTool: Tool;
  setCurrentTool: (tool: Tool) => void;
  penColor: string;
  setPenColor: (color: string) => void;
  penSize: number;
  setPenSize: (size: number) => void;
  eraserSize: number;
  setEraserSize: (size: number) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTool, setCurrentTool] = useState<Tool>('none');
  const [penColor, setPenColor] = useState<string>('#000000');
  const [penSize, setPenSize] = useState<number>(2);
  const [eraserSize, setEraserSize] = useState<number>(20);

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
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};


// Accessing the Eraser Functionality

Looking at the image you provided, I can see your application has a toolbar at the top with color options, but I don't see an eraser button visible in the interface. The Eraser component is correctly defined in your code, but it might not be showing up in your toolbar.

To access the eraser functionality, you'll need to:

1. Make sure the Eraser component is properly imported and rendered in your toolbar
2. Ensure your DrawingContext has the eraser state properly defined
3. Implement the eraser functionality in your Canvas component

Let's check if your DrawingContext is properly set up:
```tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Tool = 'pen' | 'eraser' | 'none';

interface DrawingContextType {
  currentTool: Tool;
  setCurrentTool: (tool: Tool) => void;
  penColor: string;
  setPenColor: (color: string) => void;
  penSize: number;
  setPenSize: (size: number) => void;
  eraserSize: number;
  setEraserSize: (size: number) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTool, setCurrentTool] = useState<Tool>('none');
  const [penColor, setPenColor] = useState<string>('#000000');
  const [penSize, setPenSize] = useState<number>(2);
  const [eraserSize, setEraserSize] = useState<number>(20);

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
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};