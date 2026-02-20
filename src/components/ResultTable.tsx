import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import type { AnalysisResult } from "../types";
import {
  BEST_EMPLOYEE_PAIR,
  DAYS_WORKED_TOGETHER,
  NO_OVERLAPS,
  PROJECT_ID,
} from "../constants";

export const ResultTable = ({ data }: { data: AnalysisResult }) => {
  const { pair, projects } = data;
  if (!pair || !projects || projects.length === 0)
    return <Typography>{NO_OVERLAPS}</Typography>;

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: 700,
        margin: "auto",
        mt: 4,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" fontWeight={600} align="center" sx={{ py: 2 }}>
        {BEST_EMPLOYEE_PAIR}:{" "}
        <span className="text-green-700 text-2xl">{pair[0]}</span> &{" "}
        <span className="text-green-700 text-2xl">{pair[1]}</span>
      </Typography>

      <Table>
        <TableHead sx={{ backgroundColor: "#1976d2" }}>
          <TableRow>
            <TableCell
              sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
            >
              {PROJECT_ID}
            </TableCell>
            <TableCell
              sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
            >
              {DAYS_WORKED_TOGETHER}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {projects.map((p) => (
            <TableRow key={p.projectId} hover>
              <TableCell sx={{ textAlign: "center" }}>{p.projectId}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{p.days}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
