import React, { useState } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
}

export const Slider: React.FC<SliderProps> = ({ label, value, min, max, step = 1, onChange, unit = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Calculate percentage for positioning elements
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6 group relative select-none">
      <div className="flex justify-between items-end mb-3">
        <label className="text-[11px] font-semibold text-[#8C847C] uppercase tracking-widest">{label}</label>
         <span className={`text-[11px] font-mono text-[#8C847C] transition-opacity duration-200 ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
          {value}{unit}
        </span>
      </div>
      
      <div className="relative w-full h-2 flex items-center cursor-pointer">
        {/* Track Background */}
        <div className="absolute w-full h-2 bg-[#F0EBE5] rounded-full overflow-hidden"></div>
        
        {/* Track Fill - Soft Sage */}
        <div 
          className="absolute h-2 bg-[#9CAF88] rounded-full transition-all duration-75 will-change-[width]"
          style={{ width: `${percentage}%` }}
        ></div>

        {/* Interactive Input Layer */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute w-full h-full opacity-0 cursor-ew-resize z-20"
        />

        {/* Custom Thumb - White pill with soft shadow */}
        <div 
          className={`absolute h-5 w-5 bg-white rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.1)] border border-[#F0EBE5] transition-transform duration-200 pointer-events-none z-10 -translate-x-1/2 top-1/2 -mt-2.5 flex items-center justify-center
            ${isDragging ? 'scale-125 border-[#9CAF88]' : 'scale-100'}
          `}
          style={{ left: `${percentage}%` }}
        >
          <div className="w-1.5 h-1.5 bg-[#9CAF88] rounded-full"></div>
        </div>
        
      </div>
    </div>
  );
};