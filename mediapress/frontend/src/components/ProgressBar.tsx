interface Props {
  progress: number;
  label?: string;
}

export function ProgressBar({ progress, label }: Props) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-sm font-bold text-blue-600">{progress}%</p>
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
