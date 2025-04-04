import React from 'react';
import { useDrawing } from '../contexts/DrawingContext';

/**
 * ColorPicker Component
 * 
 * Displays a row of color buttons for selecting the pen color
 * Automatically switches to pen tool when a color is selected
 * 
 * @returns {JSX.Element} - Rendered component
 */
const ColorPicker: React.FC = () => {
  // Get drawing context values and functions
  const { penColor, setPenColor, setCurrentTool } = useDrawing();

  // Available colors with descriptive comments
  const colors = [
    '#000000', // black
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

  return (
    <div className="flex space-x-2">
      {colors.map((color) => (
        <button
          key={color}
          className={`w-6 h-6 rounded-full border ${color === penColor ? 'border-white border-2' : 'border-gray-300'}`}
          style={{ backgroundColor: color }}
          onClick={() => {
            setPenColor(color);
            setCurrentTool('pen');
          }}
        />
      ))}
    </div>
  );
};

export default ColorPicker;