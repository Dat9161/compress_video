interface Props {
  progress: number;
  label?: string;
}

export function ProgressBar({ progress, label }: Props) {
  return (
    <div className="w-full">
      {label && <p className="text-sm text-gray-500 mb-1">{label} — {progress}%</p>}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
