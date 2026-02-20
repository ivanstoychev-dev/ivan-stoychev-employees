import type { RecordRow } from "../types";
import { parseDate } from "./dateParser";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeRecord(r: any): RecordRow | null {
  const empId = r.empId ?? r.employeeId ?? r.employeeID ?? r.emp_id ?? r.EmpID;

  const projectId = r.projectId ?? r.projectID ?? r.ProjectId ?? r.ProjectID;

  const fromRaw =
    r.from ?? r.dateFrom ?? r.DateFrom ?? r.startDate ?? r.start_date;

  const toRaw = r.to ?? r.dateTo ?? r.DateTo ?? r.endDate ?? r.end_date;

  const from = parseDate(fromRaw);
  const to = parseDate(toRaw);

  if (!empId || !projectId || !from || !to) return null;

  return {
    empId: String(empId),
    projectId: String(projectId),
    from,
    to,
  };
}
