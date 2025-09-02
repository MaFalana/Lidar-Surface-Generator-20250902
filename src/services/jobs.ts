import { api } from './api';
import { JobStatusResponse, DownloadResponse } from '../types';

export const getJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  const response = await api.get<JobStatusResponse>(`/api/v1/jobs/${jobId}`);
  return response.data;
};

export const getDownloadUrls = async (jobId: string, expiryHours: number = 1): Promise<DownloadResponse> => {
  const response = await api.get<DownloadResponse>(`/api/v1/download/${jobId}`, {
    params: { expiry_hours: expiryHours }
  });
  return response.data;
};

export const downloadFile = async (url: string, filename: string): Promise<void> => {
  // Create a hidden anchor element and trigger download
  // This works with Azure Blob Storage SAS URLs without CORS issues
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};