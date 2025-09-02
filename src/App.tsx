import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FileUpload } from './components/FileUpload/FileUpload';
import { Configuration } from './components/Configuration/Configuration';
import { Preview } from './components/Preview/Preview';
import { Download } from './components/Download/Download';
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

  // Poll job status
  useEffect(() => {
    if (!currentJobId || !isPolling) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await getJobStatus(currentJobId);
        setJobStatus(status.status);

        if (status.status === 'completed') {
          setIsPolling(false);
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
      const response = await fetch(csvUrl);
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header if present
      const dataLines = lines[0].includes('Point') ? lines.slice(1) : lines;
      
      const points: PNEZDPoint[] = dataLines.slice(0, 50).map((line, index) => {
        const [point, northing, easting, elevation, ...descParts] = line.split(',');
        return {
          point: parseInt(point) || index + 1,
          northing: parseFloat(northing) || 0,
          easting: parseFloat(easting) || 0,
          elevation: parseFloat(elevation) || 0,
          description: descParts.join(',').trim() || '',
        };
      });
      
      setPreviewPoints(points);
    } catch (error) {
      console.error('Error loading preview:', error);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('Please select files to process');
      return;
    }

    setIsProcessing(true);
    setJobStatus('queued');

    try {
      const response = await uploadFiles(files, config, (progress) => {
        console.log('Upload progress:', progress);
      });

      setCurrentJobId(response.job_id);
      setIsPolling(true);
      toast.success('Files uploaded successfully! Processing started...');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Upload failed');
      setIsProcessing(false);
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/HWC Logo_Dark.png" 
                alt="HWC Engineering" 
                className="h-10"
              />
              <div>
                <h1 className="text-2xl font-bold text-hwc-dark">LiDAR Surface Generator</h1>
                <p className="text-sm text-gray-600">Process point cloud files to generate surface breaklines</p>
              </div>
            </div>
            {jobStatus && (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  jobStatus === 'completed' ? 'bg-green-500' :
                  jobStatus === 'failed' ? 'bg-red-500' :
                  jobStatus === 'processing' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`}></div>
                <span className="text-sm font-medium capitalize">{jobStatus}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <FileUpload files={files} onFilesChange={setFiles} />
            <Configuration
              config={config}
              onConfigChange={setConfig}
              onProcess={handleProcess}
              isProcessing={isProcessing || isPolling}
              filesSelected={files.length > 0}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Preview 
              points={previewPoints} 
              isLoading={isPolling && jobStatus === 'processing'}
              totalPoints={previewPoints.length}
            />
            <Download
              downloadUrls={downloadUrls}
              isDownloading={isDownloading}
              onDownload={handleDownload}
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