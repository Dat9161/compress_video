import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { downloadJob } from '../utils/download';
import type { Job } from '../types';

const STATUS_LABEL: Record<Job['status'], string> = {
  PENDING: '⏳ Chờ',
  PROCESSING: '⚙️ Đang xử lý',
  COMPLETED: '✅ Hoàn thành',
  FAILED: '❌ Thất bại',
};

const STATUS_COLOR: Record<Job['status'], string> = {
  PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  PROCESSING: 'text-blue-600 bg-blue-50 border-blue-200',
  COMPLETED: 'text-green-600 bg-green-50 border-green-200',
  FAILED: 'text-red-600 bg-red-50 border-red-200',
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function HistoryPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Job[]>('/jobs').then(({ data }) => setJobs(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/jobs/${id}`);
    setJobs((j) => j.filter((x) => x.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Lịch sử xử lý</h1>
          <p className="text-gray-500 text-sm mt-1">File được lưu trong 7 ngày</p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 sm:p-12 text-center">
            <p className="text-4xl mb-3">📂</p>
            <p className="text-gray-500">Chưa có tác vụ nào.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
                {/* Top row: filename + status badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                    {job.inputFile.filename}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${STATUS_COLOR[job.status]}`}>
                    {STATUS_LABEL[job.status]}
                  </span>
                </div>

                {/* Size info */}
                <p className="text-xs sm:text-sm text-gray-500 mb-3">
                  {formatBytes(job.inputFile.size)}
                  {job.outputFile && (
                    <span className="text-green-600"> → {formatBytes(job.outputFile.size)}</span>
                  )}
                  <span className="mx-1.5 text-gray-300">·</span>
                  {new Date(job.createdAt).toLocaleString('vi-VN')}
                </p>

                {job.errorMessage && (
                  <p className="text-xs text-red-500 mb-3">{job.errorMessage}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {job.status === 'COMPLETED' && (
                    <button onClick={() => downloadJob(job.id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Tải xuống
                    </button>
                  )}
                  <button onClick={() => handleDelete(job.id)}
                    className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
