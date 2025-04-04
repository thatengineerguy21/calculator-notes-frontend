import React from 'react';
import { Slider } from './ui/slider';

interface SizeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
}

const SizeSlider: React.FC<SizeSliderProps> = ({ value, onChange, min, max, label }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium">{label}: {value}px</label>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={(values) => onChange(values[0])}
        className="w-32"
      />
    </div>
  );
};

export default SizeSlider;