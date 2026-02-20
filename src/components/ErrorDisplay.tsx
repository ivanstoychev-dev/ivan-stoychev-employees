import { CSV_ERRORS, ROW } from "../constants";
import type { CsvError } from "../types";

function ErrorDisplay({ errors }: { errors: CsvError[] | undefined }) {
  if (!errors || errors.length === 0) return;

  return (
    <div className="bg-red-900/80 p-4 rounded text-white">
      <h2 className="font-bold mb-2">{CSV_ERRORS}</h2>
      <ul className="list-disc list-inside space-y-1">
        {errors.map((e, i) => (
          <li key={i}>
            {ROW} {e.row}: {e.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ErrorDisplay;
