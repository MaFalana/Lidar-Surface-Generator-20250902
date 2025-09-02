export interface UploadResponse {
  job_id: string;
  status: JobStatus;
  message: string;
  files_uploaded: number;
}

export interface JobStatusResponse {
  job_id: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  progress?: number;
  input_files: string[];
  output_files?: string[];
  error_message?: string;
}

export interface DownloadResponse {
  job_id: string;
  download_urls: Record<string, string>;
  expires_at: string;
}

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'deleted';

export interface ProcessingConfig {
  voxel_size?: number;
  threshold?: number;
  nth_point?: number;
  source_epsg?: number;
  target_epsg?: number;
  output_formats?: string;
  merge_outputs?: boolean;
  merged_output_name?: string;
}

export interface EPSGOption {
  name: string;
  unit: string;
  proj4: string;
  _id: number;
}

export interface GridSpacingOption {
  label: string;
  value: number;
}

export interface PNEZDPoint {
  point: number;
  northing: number;
  easting: number;
  elevation: number;
  description: string;
}