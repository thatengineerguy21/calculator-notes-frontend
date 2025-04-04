import React, { useState, useRef, useEffect } from 'react';
import { Eraser, Undo, Redo } from 'lucide-react';
import { DrawingProvider } from '../contexts/DrawingContext';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';

// Define your drawing tool type
type DrawingTool = 'pen' | 'eraser' | 'none';

// Define a type for our history states
type HistoryState = ImageData;

/**
 * Home Component
 * 
 * The main screen of the application
 * Wraps the drawing interface with the DrawingProvider
 * 
 * @returns {JSX.Element} - Rendered component
 */
const Home: React.FC = () => {
  return (
    <DrawingProvider>
      <div className="flex flex-col h-screen">
        {/* App Header */}
        <div className="bg-black text-white p-3 text-center font-bold text-xl shadow-md">
          Calculator Notes
        </div>
        <Toolbar />
        <Canvas />
      </div>
    </DrawingProvider>
  );
};

export default Home;