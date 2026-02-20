import React, { useState } from "react";

function DragAndDrop({
  fileName,
  handleFile,
}: {
  fileName: string;
  handleFile: (file: File) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative border-2 ${
        dragOver ? "border-indigo-500" : "border-gray-500"
      } border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors bg-black/50 text-white cursor-pointer`}
    >
      <input
        type="file"
        accept=".csv,.tsv,.json,.xlsx"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => {
          if (e.target.files?.length) handleFile(e.target.files[0]);
        }}
      />

      <button className="mb-4 px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-lg shadow-md">
        {fileName ? "Change File" : "Select CSV File"}
      </button>

      <span className="text-gray-300 text-center">
        {fileName ? `Selected file: ${fileName}` : "Or drag & drop a CSV here"}
      </span>
    </div>
  );
}

export default DragAndDrop;
