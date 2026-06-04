"use client";

import { motion } from "framer-motion";

interface SliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

export function Slider({ min, max, value, onChange, step = 1 }: SliderProps) {
  const handleChange = (index: 0 | 1, newValue: number) => {
    const newValues: [number, number] = [...value] as [number, number];
    newValues[index] = Math.max(min, Math.min(max, newValue));
    if (index === 0 && newValues[0] > newValues[1]) newValues[1] = newValues[0];
    if (index === 1 && newValues[1] < newValues[0]) newValues[0] = newValues[1];
    onChange(newValues);
  };

  const leftPercent = ((value[0] - min) / (max - min)) * 100;
  const rightPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="relative h-2 bg-dark-800 rounded-full">
      <motion.div
        className="absolute h-2 bg-gold-500 rounded-full"
        style={{
          left: `${leftPercent}%`,
          width: `${rightPercent - leftPercent}%`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${rightPercent - leftPercent}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value[0]}
        onChange={(e) => handleChange(0, parseInt(e.target.value))}
        step={step}
        className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value[1]}
        onChange={(e) => handleChange(1, parseInt(e.target.value))}
        step={step}
        className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
      />
    </div>
  );
}
