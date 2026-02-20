import * as XLSX from "xlsx";
import { parseDate } from "./dateParser";
import type { CsvError, RecordRow, AnalysisOutput, PairResult } from "../types";
import {
  DATE_FROM_AFTER_DATE_TO,
  INVALID_DATE_FROM,
  INVALID_DATE_TO,
  MISSING_EMPLOYEE_ID,
  MISSING_PROJECT_ID,
  NOT_ENOUGH_COLUMNS,
  UNKNOWN_FILE_TYPE,
  UNSUPPORTED_FORMAT,
} from "../constants";

const DAY_MS = 1000 * 60 * 60 * 24;

function overlapDays(a: RecordRow, b: RecordRow): number {
  const start = Math.max(a.from.getTime(), b.from.getTime());
  const end = Math.min(a.to.getTime(), b.to.getTime());
  return start <= end ? Math.floor((end - start) / DAY_MS) : 0;
}

export function checkRowErrors(
  cols: string[],
  rowNum: number,
  from: Date | null,
  to: Date | null,
): CsvError[] {
  const errors: CsvError[] = [];
  const [empId, projectId, fromRaw, toRaw] = cols;

  if (cols.length < 4) {
    errors.push({ row: rowNum, message: NOT_ENOUGH_COLUMNS });
    return errors;
  }

  if (!empId) errors.push({ row: rowNum, message: MISSING_EMPLOYEE_ID });
  if (!projectId) errors.push({ row: rowNum, message: MISSING_PROJECT_ID });
  if (!from)
    errors.push({ row: rowNum, message: `${INVALID_DATE_FROM}: "${fromRaw}"` });
  if (!to)
    errors.push({ row: rowNum, message: `${INVALID_DATE_TO}: "${toRaw}"` });
  if (from && to && from > to)
    errors.push({ row: rowNum, message: DATE_FROM_AFTER_DATE_TO });

  return errors;
}

export function parseCSVRows(
  text: string,
  delimiter = ",",
): { records: RecordRow[]; errors: CsvError[] } {
  const records: RecordRow[] = [];
  const errors: CsvError[] = [];

  text
    .trim()
    .split("\n")
    .forEach((line, index) => {
      const rowNum = index + 1;
      if (!line.trim()) return;

      const cols = line.split(delimiter).map((c) => c.trim());
      if (cols.every((c) => c === "")) return;

      const [empId, projectId, fromRaw, toRaw] = cols;
      const from = parseDate(fromRaw);
      const to = parseDate(toRaw);

      const rowErrors = checkRowErrors(cols, rowNum, from, to);
      errors.push(...rowErrors);

      if (rowErrors.length > 0 || !from || !to) return;

      records.push({ empId, projectId, from, to });
    });

  return { records, errors };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeRecord(r: any): RecordRow | null {
  const empId = r.empId ?? r.employeeId ?? r.employeeID ?? r.emp_id ?? r.EmpID;
  const projectId = r.projectId ?? r.projectID ?? r.ProjectId ?? r.ProjectID;
  const fromRaw =
    r.from ?? r.dateFrom ?? r.DateFrom ?? r.startDate ?? r.start_date;
  const toRaw = r.to ?? r.dateTo ?? r.DateTo ?? r.endDate ?? r.end_date;

  const from = parseDate(fromRaw);
  const to = parseDate(toRaw);

  if (!empId || !projectId || !from || !to) return null;

  return { empId: String(empId), projectId: String(projectId), from, to };
}

export function analyzeEmployeePairs(records: RecordRow[]): PairResult {
  const totals = new Map<string, number>();
  const details = new Map<string, { projectId: string; days: number }[]>();

  for (let i = 0; i < records.length; i++) {
    for (let j = i + 1; j < records.length; j++) {
      const a = records[i];
      const b = records[j];

      if (a.empId === b.empId || a.projectId !== b.projectId) continue;

      const days = overlapDays(a, b);
      if (days <= 0) continue;

      const key = [a.empId, b.empId].sort().join(":");
      totals.set(key, (totals.get(key) ?? 0) + days);

      if (!details.has(key)) details.set(key, []);
      details.get(key)!.push({ projectId: a.projectId, days });
    }
  }

  return { totals, details };
}

export function findBestPair(
  totals: Map<string, number>,
  details: Map<string, { projectId: string; days: number }[]>,
) {
  let bestKey: string | null = null;
  let maxDays = 0;

  for (const [key, totalDays] of totals.entries()) {
    if (totalDays > maxDays) {
      maxDays = totalDays;
      bestKey = key;
    }
  }

  if (!bestKey) return null;

  return {
    pair: bestKey.split(":") as [string, string],
    projects: details.get(bestKey)!,
    totalDays: maxDays,
  };
}

export function getCSV(
  text: string,
  delimiter = ",",
): { records: RecordRow[]; errors: CsvError[] } {
  const records: RecordRow[] = [];
  const errors: CsvError[] = [];

  text
    .trim()
    .split("\n")
    .forEach((line, index) => {
      const rowNum = index + 1;
      if (!line.trim()) return;

      const cols = line.split(delimiter).map((c) => c.trim());
      if (cols.every((c) => c === "")) return;

      const [empId, projectId, fromRaw, toRaw] = cols;
      const from = parseDate(fromRaw);
      const to = parseDate(toRaw);

      const rowErrors = checkRowErrors(cols, rowNum, from, to);
      errors.push(...rowErrors);

      if (rowErrors.length > 0 || !from || !to) return;

      records.push({ empId, projectId, from, to });
    });

  return { records, errors };
}

export async function getJSON(file: File): Promise<RecordRow[]> {
  const text = await file.text();
  const json = JSON.parse(text);
  return json.map(normalizeRecord).filter(Boolean) as RecordRow[];
}

export async function getXLSX(file: File): Promise<RecordRow[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = XLSX.utils.sheet_to_json<any>(sheet);
  return json.map(normalizeRecord).filter(Boolean) as RecordRow[];
}

export async function analyzeFile(
  file: File,
  delimiter = ",",
): Promise<AnalysisOutput> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext) throw new Error(UNKNOWN_FILE_TYPE);

  let records: RecordRow[] = [];
  let errors: CsvError[] = [];

  if (ext === "csv" || ext === "tsv") {
    const text = await file.text();
    const delim = ext === "tsv" ? "\t" : delimiter;
    const parsed = getCSV(text, delim);
    records = parsed.records;
    errors = parsed.errors;
  } else if (ext === "json") {
    records = await getJSON(file);
  } else if (ext === "xlsx") {
    records = await getXLSX(file);
  } else {
    throw new Error(UNSUPPORTED_FORMAT);
  }

  const { totals, details } = analyzeEmployeePairs(records);
  const result = findBestPair(totals, details);

  return { result, errors };
}
