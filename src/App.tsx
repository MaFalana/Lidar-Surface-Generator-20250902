import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FileUpload } from './components/FileUpload/FileUpload';
import { Configuration } from './components/Configuration/Configuration';
import { Preview } from './components/Preview/Preview';
import { Download } from './components/Download/Download';
import { ProgressIndicator } from './components/Progress/ProgressIndicator';
import { uploadFiles } from './services/upload';
import { getJobStatus, getDownloadUrls, downloadFile } from './services/jobs';
import { ProcessingConfig, JobStatus, PNEZDPoint } from './types';
import './styles/index.css';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [config, setConfig] = useState<ProcessingConfig>({});
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [previewPoints, setPreviewPoints] = useState<PNEZDPoint[]>([]);
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string> | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [jobProgress, setJobProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  // Poll job status
  useEffect(() => {
    if (!currentJobId || !isPolling) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await getJobStatus(currentJobId);
        setJobStatus(status.status);
        setJobProgress(status.progress || 0);

        if (status.status === 'completed') {
          setIsPolling(false);
          setIsProcessing(false);
          setShowProgress(false);
          toast.success('Processing completed successfully!');
          
          // Get download URLs
          const urls = await getDownloadUrls(currentJobId);
          setDownloadUrls(urls.download_urls);
          
          // Parse CSV for preview if available
          const csvUrl = Object.entries(urls.download_urls).find(([name]) => name.endsWith('.csv'))?.[1];
          if (csvUrl) {
            await loadPreviewFromCsv(csvUrl);
          }
        } else if (status.status === 'failed') {
          setIsPolling(false);
          setIsProcessing(false);
          setShowProgress(false);
          toast.error(status.error_message || 'Processing failed');
        }
      } catch (error) {
        console.error('Error polling job status:', error);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [currentJobId, isPolling]);

  const loadPreviewFromCsv = async (csvUrl: string) => {
    try {
      // Use fetch with proper headers to avoid CORS
      const response = await fetch(csvUrl, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        console.warn('CSV file is empty');
        return;
      }
      
      // Parse CSV - expect format: Point,Northing,Easting,Elevation,Description
      // Skip header row if it contains text
      const hasHeader = lines[0].toLowerCase().includes('point') || 
                       lines[0].toLowerCase().includes('northing') ||
                       lines[0].toLowerCase().includes('easting');
      const dataLines = hasHeader ? lines.slice(1) : lines;
      
      const points: PNEZDPoint[] = dataLines.slice(0, 50).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        return {
          point: parseInt(values[0]) || index + 1,
          northing: parseFloat(values[1]) || 0,
          easting: parseFloat(values[2]) || 0,
          elevation: parseFloat(values[3]) || 0,
          description: values[4] || '',
        };
      }).filter(point => !isNaN(point.northing) && !isNaN(point.easting) && !isNaN(point.elevation));
      
      setPreviewPoints(points);
    } catch (error) {
      console.error('Error loading preview:', error);
      toast.error('Failed to load preview data');
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('Please select files to process');
      return;
    }

    // Reset state for new processing
    setIsProcessing(true);
    setShowProgress(true);
    setUploadProgress(0);
    setJobProgress(0);
    setJobStatus('queued');
    setPreviewPoints([]);
    setDownloadUrls(null);

    try {
      const response = await uploadFiles(files, config, (progress) => {
        setUploadProgress(progress);
      });

      setCurrentJobId(response.job_id);
      setIsPolling(true);
      toast.success('Files uploaded successfully! Processing started...');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Upload failed');
      setIsProcessing(false);
      setShowProgress(false);
      setJobStatus(null);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    setIsDownloading(true);
    try {
      await downloadFile(url);
      toast.success(`Downloaded ${filename}`);
    } catch (error) {
      toast.error('Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/HWC Logo_Dark.png" 
                alt="HWC Engineering" 
                className="h-8 sm:h-10"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-hwc-dark">LiDAR Surface Generator</h1>
                <p className="text-xs sm:text-sm text-gray-600">Process point cloud files to generate surface breaklines</p>
              </div>
            </div>
            {showProgress && (
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  uploadProgress < 100 ? 'bg-blue-500 animate-pulse' :
                  jobStatus === 'completed' ? 'bg-green-500' :
                  jobStatus === 'failed' ? 'bg-red-500' :
                  jobStatus === 'processing' ? 'bg-yellow-500 animate-pulse' :
                  'bg-gray-500'
                }`}></div>
                <span className="text-sm font-medium">
                  {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` :
                   jobStatus === 'completed' ? 'Completed' :
                   jobStatus === 'failed' ? 'Failed' :
                   jobStatus === 'processing' ? `Processing... ${jobProgress}%` :
                   'Queued'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Sticky Progress Bar */}
        {showProgress && (
          <div className="bg-white border-t border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
            <div className="max-w-7xl mx-auto">
              <ProgressIndicator
                stage={uploadProgress < 100 ? 'upload' : jobStatus === 'completed' ? 'completed' : jobStatus === 'failed' ? 'failed' : 'processing'}
                uploadProgress={uploadProgress}
                jobStatus={jobStatus}
                jobProgress={jobProgress}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <FileUpload files={files} onFilesChange={setFiles} />
            <Preview 
              points={previewPoints} 
              isLoading={isPolling && jobStatus === 'processing'}
              totalPoints={previewPoints.length}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Configuration
              config={config}
              onConfigChange={setConfig}
              onProcess={handleProcess}
              isProcessing={isProcessing || isPolling}
              filesSelected={files.length > 0}
            />
            <Download
              downloadUrls={downloadUrls}
              isDownloading={isDownloading}
              onDownload={handleDownload}
              mergeEnabled={config.merge_outputs}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} HWC Engineering. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;