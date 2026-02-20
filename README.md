# Employee Pair Analyzer

A **React + TypeScript** app that analyzes which pair of employees has worked together the most across projects. It supports CSV, TSV, JSON, and Excel (XLSX) files with robust error handling and a clean, responsive UI.

# Features

- Drag-and-drop file upload (or click to select a file)
- Supports multiple file formats: CSV, TSV, JSON, Excel (XLSX)
- Automatically parses and normalizes:
  - Employee IDs (`empId`, `employeeId`, `EmpID`, etc.)
  - Project IDs (`projectId`, `ProjectID`, etc.)
  - Date ranges (`from/to`, `startDate/endDate`, etc.)
- Calculates overlapping days per project
- Detects invalid/missing rows and logs errors
- Displays results in a clean, responsive table
- Fully modular and TypeScript typed

# File Formats & Examples

## CSV

empId,projectId,from,to
101,1001,2023-01-01,2023-01-10
102,1001,2023-01-05,2023-01-15
103,1002,2023-02-01,2023-02-10

## JSON

[
{ "employeeId": "101", "projectID": "1001", "dateFrom": "2023-01-01", "dateTo": "2023-01-10" },
{ "empId": "102", "projectId": "1001", "from": "2023-01-05", "to": "2023-01-15" }
]

## Excel (XLSX) Example

4 columns: empId, projectId, from, to
Can contain invalid or missing data — will be skipped or reported as errors

# Usage

1.Open the app in your browser.
2.Drag-and-drop your file or click to select it.
3.The analyzer will:

- Parse the file
- Normalize keys and dates
- Calculate overlapping days
- Show the best employee pair and projects
- Display any errors encountered

## Example Output

{
"result": {
"pair": ["101", "102"],
"projects": [
{ "projectId": "1001", "days": 5 }
],
"totalDays": 5
},
"errors": [
{ "row": 4, "message": "Invalid DateFrom: \"invalid\"" },
{ "row": 5, "message": "Missing EmpID" }
]
}

# Tech Stack

- React
- TypeScript
- Node.js
- XLSX parsing
- CSV / TSV / JSON parsing
- Fully TypeScript typed for reliability

# Installation & Running

```bash
# Clone repository
git clone https://github.com/ivanstoychev-dev/ivan-stoychev-employees.git
cd ivan-stoychev-employees

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev

```
