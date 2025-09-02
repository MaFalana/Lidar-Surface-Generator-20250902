# Mission Statement

Using the backend api I created for my *LiDAR Surface Generator* utilize the api functions in a Web App. The goal is to improve performance time and user experience. important code can be found [here](/source)

## How it Currently Works

Right now it works by taking a classified (ASPRS) point cloud or multiple clouds (las/laz) extracting the points and breaklines from the ground class and outputting those points and breaklines into a dxf in the same directory the point cloud was pulled from.

It also has a reprojection mode where it can reproject the points and breaklines in a dxf from state plane to county coordinates using EPSG codes.


## How I *Want* It To Work

- Option for the user to make a single DXF file from multiple point clouds

  - Points and breaklines should be concatenated into the results file

- Option to preview the points and breaklines in PNEZD

- Option to download the preview as a csv

- For users to select source and target coordinate reference systems EPSG codes from a combobox.

- Option to set the coordinate reference system of the DXF file

- Point Cloud(s) Preview?

- Workflow/progress indicators

- Output DXF file

- NO MOCK DATA

- Dont have to refresh the page to process more clouds

