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

export const downloadFile = async (url: string): Promise<void> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const filename = url.split('/').pop() || 'download';
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};