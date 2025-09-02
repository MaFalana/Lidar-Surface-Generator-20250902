# TASKS.md - LiDAR Surface Generator Frontend

## Session Context
Building a responsive React/TypeScript frontend for the LiDAR Surface Generator API. The backend FastAPI server handles point cloud processing, file uploads/downloads, and job management (including automatic file deletion). Frontend will provide a clean interface matching HWC Engineering branding.

API is deployed at: https://surface-gen-api.purplebush-adcf4e3b.eastus.azurecontainerapps.io/
Azure Blob Storage is configured with automatic file maintenance handled by the API.

## Current Tasks ✅
- [x] Review existing project structure and API documentation
- [x] Review reference images and style specifications  
- [x] Review openapi.json to understand API endpoints
- [x] Check environment configuration files
- [x] Create TASKS.md file in /docs

## Ongoing Tasks 🔄
- [ ] Create PLAN.md file in /docs
- [ ] Create README.md for project overview

## Future Tasks 📋
- [ ] Design frontend architecture based on FastAPI backend
- [ ] Set up React/TypeScript project with Vite
- [ ] Configure Tailwind CSS with HWC color palette
- [ ] Implement responsive webpage layout (4 sections as per spec)
- [ ] Section 1: File upload with drag-and-drop
- [ ] Section 2: Configuration controls (grid spacing, CRS, merge option)
- [ ] Section 3: PNEZD preview table with statistics
- [ ] Section 4: Output format selection and download (DXF, CSV)
- [ ] Integrate file upload functionality with API
- [ ] Implement job status polling
- [ ] Add progress tracking and status updates
- [ ] Implement download functionality
- [ ] Style according to HWC brand guidelines
- [ ] Add error handling and user feedback
- [ ] Testing and optimization

## API Endpoints Summary
- **POST /api/v1/upload/** - Upload LAS/LAZ files for processing
- **GET /api/v1/jobs/{job_id}** - Get job status and progress
- **GET /api/v1/download/{job_id}** - Get download URLs for outputs
- **GET /api/v1/health/** - Health check endpoint

## Key Requirements
- Responsive single-page application
- HWC Engineering branding (colors: #EE2F27, #292C30, #6C6864, #DDD4CC)
- API handles all file maintenance/deletion automatically
- Support for LAS/LAZ point cloud files
- Output formats: DXF (primary), CSV (optional)
- PNEZD preview showing first 50 processed points (sourced from CSV)
- Modern dashboard layout as shown in Reference Image 2