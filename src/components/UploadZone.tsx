import { useState, useRef } from "react";
import { UploadCloud, FileUp, Loader2 } from "lucide-react";

interface Props {
  onUpload: (file: File) => void;
  extracting: boolean;
}

export default function UploadZone({ onUpload, extracting }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !extracting && inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
        dragOver
          ? "border-navy-600 dark:border-sky-400 bg-sky-50 dark:bg-sky-400/10 scale-[1.01]"
          : "border-slate-200 dark:border-night-border bg-slate-50 dark:bg-night-card hover:border-sky-300 dark:hover:border-sky-500 hover:bg-sky-50/40 dark:hover:bg-sky-400/5"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleSelect}
      />

      {extracting ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-night-text">
              Extracting facts...
            </p>
            <p className="text-xs text-slate-500 dark:text-night-muted mt-1">
              Reading the notice and finding key information
            </p>
          </div>
        </div>
      ) : fileName ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-400/10 flex items-center justify-center">
            <FileUp className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-night-text">{fileName}</p>
            <p className="text-xs text-slate-500 dark:text-night-muted mt-1">
              Drop another file or click to upload
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-400/10 flex items-center justify-center">
            <UploadCloud className="w-7 h-7 text-sky-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-night-text">
              Drop a notice file here
            </p>
            <p className="text-xs text-slate-500 dark:text-night-muted mt-1">
              or click to browse — PDF, image, or any file
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
