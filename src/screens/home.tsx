import React, { useState, useRef, useEffect } from 'react';
import { Eraser } from 'lucide-react';

// Define your drawing tool type
type DrawingTool = 'pen' | 'eraser' | 'none';

const Home: React.FC = () => {
  // Add state for the current tool and color
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [eraserSize, setEraserSize] = useState(20);
  const [penSize, setPenSize] = useState(2);

  // Available colors
  const colors = [
    '#000000', // black (changed from white)
    '#FF3030', // red
    '#FF69B4', // pink
    '#9370DB', // purple
    '#8B4513', // brown
    '#1E90FF', // blue
    '#0000CD', // dark blue
    '#32CD32', // green
    '#008000', // dark green
    '#FFD700', // gold
    '#FFA500', // orange
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size to match parent container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Fill canvas with white background
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Function to handle reset
  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear canvas
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Function to handle run
  const handleRun = () => {
    // Add your run logic here
    console.log('Run clicked');
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);

    if (currentTool === 'pen') {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = currentColor;
      context.lineWidth = penSize;
    } else if (currentTool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.strokeStyle = 'rgba(0,0,0,1)';
      context.lineWidth = eraserSize;
    }

    context.lineCap = 'round';
    context.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-2 bg-black text-white">
        <button 
          className="px-4 py-2"
          onClick={handleReset}
        >
          Reset
        </button>
        
        {/* Color buttons */}
        <div className="flex space-x-2">
          {colors.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
              onClick={() => {
                setCurrentColor(color);
                setCurrentTool('pen');
              }}
            />
          ))}
        </div>
        
        {/* Add Eraser button here */}
        <button 
          className={`px-4 py-2 flex items-center gap-2 ${currentTool === 'eraser' ? 'bg-gray-700' : ''}`}
          onClick={() => setCurrentTool(currentTool === 'eraser' ? 'pen' : 'eraser')}
        >
          <Eraser size={18} />
          Eraser
        </button>
        
        <button 
          className="px-4 py-2"
          onClick={handleRun}
        >
          Run
        </button>
      </div>
      
      {/* Canvas for drawing */}
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
    </div>
  );
};

export default Home;