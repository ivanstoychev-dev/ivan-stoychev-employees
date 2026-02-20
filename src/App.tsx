import { useState, useCallback } from "react";
import type { AnalysisOutput } from "./types";
import { ResultTable } from "./components/ResultTable";
import {
  EMPLOYEE_PAIR_ANALYZER,
  UNSUPPORTED_OR_INVALID_FILE,
} from "./constants";
import DragAndDrop from "./components/DragAndDrop";
import ErrorDisplay from "./components/ErrorDisplay";
import { analyzeFile } from "./utils/analyzer";

export default function App() {
  const [output, setOutput] = useState<AnalysisOutput | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);

    try {
      const result = await analyzeFile(file);
      setOutput(result);
    } catch (e) {
      alert(UNSUPPORTED_OR_INVALID_FILE);
      console.error(e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 flex justify-center items-start py-10 px-4">
      <div className="bg-gray-900 rounded-sm p-4 lg:p-10 w-full max-w-lg flex flex-col gap-6">
        <h1 className="text-3xl text-center font-bold text-white">
          {EMPLOYEE_PAIR_ANALYZER}
        </h1>
        <DragAndDrop fileName={fileName} handleFile={handleFile} />
        <ErrorDisplay errors={output?.errors} />
        {output?.result && <ResultTable data={output.result} />}
      </div>
    </div>
  );
}
