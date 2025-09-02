# Technical Stack

**Design Highlights:**  
- API handles uploads, job creation, and output retrieval  
- processes LiDAR data asynchronously via queue  
- Raw point clouds are **ephemeral**, deleted after processing to save storage

---

## Frontend

- **React + TypeScript**
- **Tailwind CSS** for KISS and reusable components

**Workflow:**  
1. User uploads LAS/LAZ → API stores in Azure Blob (temporary)
2. User applies configurations (optional)
3. API queues a job 
4. fetch job from api → processes LiDAR → generates CSV/DXF/DWG  
5. CSV Preview is shown showing the user the first 50 points of their output (PNEZD)
6. Output files saved to Blob Storage (temporary)  
7. Frontend polls API or receives WebSocket notifications for job completion  
8. User downloads outputs

---

## Deployment

- **Frontend:** Vercel (fast global CDN) or Azure Deployment

- **Storage:**  
  - **Azure Blob Storage**  
    - `tmp/uploads/` for temporary point clouds (short lifecycle)  
    - `tmp/outputs/` for final CSV/DXF  

---

## Data Management

- **Temporary Storage:**  
  - LAS/LAZ in Blob → deleted after processing or 24h
  -  Outputs only: CSV, DXF → deleted after user download or 24h

---

### API

Coordinate Reference Systems can be sourced from:

- [Local JSON](/source/EPSG.json)

Returns an array of objects:

```json
{
    "name": "NAD27 / Indiana West",
    "unit": "US survey foot",
    "proj4": "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=152400.30480061 +y_0=0 +ellps=clrk66 +nadgrids=ca_nrc_ntv2_0.tif +units=us-ft +no_defs +type=crs",
    "_id": 26774
  },
```

**Purpose:** Locks AI to a consistent tech stack, preventing unwanted deviations

### Credits and Acknowledgment

- Matthew Berman (original stack design)