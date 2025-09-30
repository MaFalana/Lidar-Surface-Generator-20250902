import React, { useState, useEffect } from 'react';

interface ThresholdControlProps {
  value: number;
  onChange: (value: number) => void;
}

const THRESHOLD_PRESETS = [
  { label: 'Gentle', value: 0.3, description: 'More breaklines' },
  { label: 'Moderate', value: 0.5, description: 'Balanced' },
  { label: 'Steep', value: 1.0, description: 'Fewer breaklines' },
];

export const ThresholdControl: React.FC<ThresholdControlProps> = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue.toString());
    onChange(newValue);
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLocalValue(inputValue);

    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 2.0) {
      onChange(numValue);
    }
  };

  const handlePresetClick = (presetValue: number) => {
    setLocalValue(presetValue.toString());
    onChange(presetValue);
  };

  const getSliderBackground = () => {
    const percentage = (value / 2.0) * 100;
    const recommendedStart = (0.3 / 2.0) * 100; // 15%
    const recommendedEnd = (1.5 / 2.0) * 100;   // 75%

    // Create a gradient with recommended zone highlighted
    return `linear-gradient(to right,
      #FEE2E2 0%,
      #FEE2E2 ${recommendedStart}%,
      #E5F3E5 ${recommendedStart}%,
      #E5F3E5 ${recommendedEnd}%,
      #FEE2E2 ${recommendedEnd}%,
      #FEE2E2 100%)`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Breakline Threshold
        </label>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-hwc-red hover:text-red-700 font-medium"
        >
          {showAdvanced ? 'Simple Mode' : 'Advanced Mode'}
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="flex gap-2">
        {THRESHOLD_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              Math.abs(value - preset.value) < 0.01
                ? 'bg-hwc-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div>{preset.label}</div>
            <div className="text-xs opacity-75">{preset.description}</div>
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={value}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-with-zones"
            style={{
              background: `linear-gradient(to right,
                #EE2F27 0%,
                #EE2F27 ${(value / 2.0) * 100}%,
                ${value < 0.3 ? '#E5E7EB' : value <= 1.5 ? '#DCFCE7' : '#E5E7EB'} ${(value / 2.0) * 100}%,
                ${value < 0.3 ? '#E5E7EB' : '#DCFCE7'} 15%,
                #DCFCE7 15%,
                #DCFCE7 75%,
                #E5E7EB 75%,
                #E5E7EB 100%)`
            }}
          />
          <div className="relative h-4 mt-1">
            <span className="absolute text-xs text-gray-500" style={{ left: '0%', transform: 'translateX(-50%)' }}>0.0</span>
            <span className="absolute text-xs text-gray-500" style={{ left: '25%', transform: 'translateX(-50%)' }}>0.5</span>
            <span className="absolute text-xs text-gray-500" style={{ left: '50%', transform: 'translateX(-50%)' }}>1.0</span>
            <span className="absolute text-xs text-gray-500" style={{ left: '75%', transform: 'translateX(-50%)' }}>1.5</span>
            <span className="absolute text-xs text-gray-500" style={{ left: '100%', transform: 'translateX(-50%)' }}>2.0</span>
          </div>
        </div>
        <div className="text-xs text-green-600 text-center mt-4">
          Recommended range: 0.3 - 1.5
        </div>

        {/* Current Value Display */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-sm text-gray-600">Current Value:</span>
          <span className="font-mono font-semibold text-hwc-red">
            {parseFloat(localValue).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Advanced Numeric Input */}
      {showAdvanced && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Manual Input (0.0 - 2.0)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="2"
              step="0.01"
              value={localValue}
              onChange={handleNumericInputChange}
              className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-hwc-red focus:border-hwc-red"
              placeholder="Enter value..."
            />
            <span className="text-sm text-blue-700">
              Range: 0.0 - 2.0
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            <strong>Recommended: 0.3 - 1.5</strong><br />
            Lower values detect more subtle terrain changes (more breaklines).<br />
            Higher values detect only significant changes (fewer breaklines).
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• <strong>Gentle (0.3):</strong> Captures subtle terrain changes - ideal for flat areas, parking lots</p>
        <p>• <strong>Moderate (0.5):</strong> Default setting - balanced for most terrains</p>
        <p>• <strong>Steep (1.0):</strong> Only major terrain changes - ideal for hillsides and steep slopes</p>
        <p className="text-amber-600 mt-2">⚠ Values below 0.3 may cause processing issues</p>
      </div>
    </div>
  );
};