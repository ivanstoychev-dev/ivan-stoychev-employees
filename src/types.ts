export type CsvError = {
  row: number;
  message: string;
};

export type RecordRow = {
  empId: string;
  projectId: string;
  from: Date;
  to: Date;
};

export type ProjectResult = {
  projectId: string;
  days: number;
};

export type AnalysisResult = {
  pair: [string, string];
  projects: ProjectResult[];
};

export type AnalysisOutput = {
  result: AnalysisResult | null;
  errors: CsvError[];
};

export type PairResult = {
  totals: Map<string, number>;
  details: Map<string, { projectId: string; days: number }[]>;
};
