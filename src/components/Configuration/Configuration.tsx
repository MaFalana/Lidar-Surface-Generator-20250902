import React, { useState, useEffect } from 'react';
import { ProcessingConfig, EPSGOption } from '../../types';
import { GRID_SPACING_OPTIONS, OUTPUT_FORMATS, INDIANA_LIDAR_INFO, LIDAR_SOURCE_INFO } from '../../utils/constants';
import epsgData from '../../../source/EPSG.json';

interface ConfigurationProps {
  config: ProcessingConfig;
  onConfigChange: (config: ProcessingConfig) => void;
  onProcess: () => void;
  isProcessing: boolean;
  filesSelected: boolean;
}

export const Configuration: React.FC<ConfigurationProps> = ({
  config,
  onConfigChange,
  onProcess,
  isProcessing,
  filesSelected,
}) => {
  const [selectedGridSpacing, setSelectedGridSpacing] = useState(GRID_SPACING_OPTIONS[0].value);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['dxf']);
  const [mergeOutputs, setMergeOutputs] = useState(false);

  const epsgOptions = epsgData as EPSGOption[];

  useEffect(() => {
    onConfigChange({
      ...config,
      voxel_size: selectedGridSpacing,
      output_formats: selectedFormats.join(','),
      merge_outputs: mergeOutputs,
    });
  }, [selectedGridSpacing, selectedFormats, mergeOutputs]);

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  return (
    <div className="section-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-hwc-red text-white rounded-lg font-semibold">
          2
        </div>
        <h2 className="text-xl font-semibold">Configure Processing</h2>
      </div>

      <div className="space-y-6">
        {/* Grid Spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Grid Spacing (Feet)
          </label>
          <div className="flex gap-3">
            {GRID_SPACING_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedGridSpacing(option.value)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedGridSpacing === option.value
                    ? 'bg-hwc-red text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-hwc-red'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Source Coordinate System */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source Coordinate System
          </label>
          <select
            className="input-field"
            value={config.source_epsg || ''}
            onChange={(e) => onConfigChange({ ...config, source_epsg: parseInt(e.target.value) })}
          >
            <option value="">Select coordinate system...</option>
            {epsgOptions.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name} ({option.unit})
              </option>
            ))}
          </select>
        </div>

        {/* Target Coordinate System */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Coordinate System
          </label>
          <select
            className="input-field"
            value={config.target_epsg || ''}
            onChange={(e) => onConfigChange({ ...config, target_epsg: parseInt(e.target.value) })}
          >
            <option value="">Select coordinate system...</option>
            {epsgOptions.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name} ({option.unit})
              </option>
            ))}
          </select>
        </div>

        {/* Output Formats */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Output Formats (select multiple)
          </label>
          <div className="flex gap-3">
            {OUTPUT_FORMATS.map((format) => (
              <button
                key={format.value}
                onClick={() => toggleFormat(format.value)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedFormats.includes(format.value)
                    ? 'bg-hwc-red text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-hwc-red'
                }`}
              >
                {selectedFormats.includes(format.value) && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {format.label}
              </button>
            ))}
          </div>
        </div>

        {/* Output Units */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Units
          </label>
          <select className="input-field" defaultValue="unitless">
            <option value="unitless">Unitless</option>
            <option value="feet">Feet</option>
            <option value="meters">Meters</option>
          </select>
        </div>

        {/* Merge Option */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={mergeOutputs}
              onChange={(e) => setMergeOutputs(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hwc-red"></div>
          </label>
          <span className="text-sm font-medium text-gray-700">
            Combine multiple point clouds into single DXF
          </span>
        </div>

        {/* Info Boxes */}
        <div className="space-y-3">
          {/* Indiana LiDAR Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-blue-900">{INDIANA_LIDAR_INFO.title}</p>
                {INDIANA_LIDAR_INFO.references.map((ref, index) => (
                  <p key={index} className="text-sm text-blue-700 mt-1">
                    {ref.name} = {ref.epsg}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* LiDAR Data Source */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 4a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-green-900">{LIDAR_SOURCE_INFO.title}</p>
                <p className="text-sm text-green-700 mt-1">{LIDAR_SOURCE_INFO.description}</p>
                <a
                  href={LIDAR_SOURCE_INFO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-green-700 hover:text-green-900"
                >
                  Visit LiDAR Source
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Process Button */}
        <button
          onClick={onProcess}
          disabled={!filesSelected || isProcessing || selectedFormats.length === 0}
          className="w-full btn-primary"
        >
          {isProcessing ? 'Processing...' : 'Process Files'}
        </button>
      </div>
    </div>
  );
};