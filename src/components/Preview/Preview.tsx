import React from 'react';
import { PNEZDPoint } from '../../types';

interface PreviewProps {
  points: PNEZDPoint[];
  isLoading: boolean;
  totalPoints?: number;
}

export const Preview: React.FC<PreviewProps> = ({ points, isLoading, totalPoints }) => {
  const calculateStats = () => {
    if (points.length === 0) return { min: 0, max: 0, avg: 0 };
    
    const elevations = points.map(p => p.elevation);
    const min = Math.min(...elevations);
    const max = Math.max(...elevations);
    const avg = elevations.reduce((a, b) => a + b, 0) / elevations.length;
    
    return { min, max, avg };
  };

  const stats = calculateStats();

  return (
    <div className="section-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-hwc-red text-white rounded-lg font-semibold">
          3
        </div>
        <h2 className="text-xl font-semibold">PNEZD Preview</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hwc-red"></div>
        </div>
      ) : points.length > 0 ? (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Points</p>
              <p className="text-lg font-semibold text-hwc-dark">{totalPoints?.toLocaleString() || points.length.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Min Elevation</p>
              <p className="text-lg font-semibold text-hwc-dark">{stats.min.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Elevation</p>
              <p className="text-lg font-semibold text-hwc-dark">{stats.avg.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Max Elevation</p>
              <p className="text-lg font-semibold text-hwc-dark">{stats.max.toFixed(2)}</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Point</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Northing</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Easting</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Elevation</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {points.slice(0, 50).map((point, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{point.point}</td>
                    <td className="px-4 py-3 text-gray-900">{point.northing.toFixed(3)}</td>
                    <td className="px-4 py-3 text-gray-900">{point.easting.toFixed(3)}</td>
                    <td className="px-4 py-3 text-gray-900">{point.elevation.toFixed(3)}</td>
                    <td className="px-4 py-3 text-gray-500">{point.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {points.length > 50 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Showing first 50 of {totalPoints?.toLocaleString() || points.length.toLocaleString()} processed points
            </p>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a3 3 0 003 3h0a3 3 0 003-3v-1m-6 0h6M9 17V7a3 3 0 013-3h0a3 3 0 013 3v10M9 17H7m8 0h2m-2 0V7m0 10v4m-6-4v4" />
          </svg>
          <p>No preview data available</p>
          <p className="text-sm mt-2">Process files to see preview</p>
        </div>
      )}
    </div>
  );
};