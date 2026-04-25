import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { api } from '../services/api';
import { downloadJob } from '../utils/download';
import type { Job } from '../types';

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const STATUS_STYLE: Record<Job['status'], { dot: string; text: string; label: string }> = {
  PENDING:    { dot: 'bg-yellow-400', text: 'text-yellow-600', label: 'Chờ xử lý' },
  PROCESSING: { dot: 'bg-blue-400 animate-pulse', text: 'text-blue-600', label: 'Đang xử lý' },
  COMPLETED:  { dot: 'bg-green-400', text: 'text-green-600', label: 'Hoàn thành' },
  FAILED:     { dot: 'bg-red-400', text: 'text-red-600', label: 'Thất bại' },
};

const TYPE_LABEL: Record<Job['type'], string> = {
  VIDEO_COMPRESS: 'Nén Video',
  VIDEO_EDIT:     'Chỉnh sửa Video',
  IMAGE_EDIT:     'Chỉnh sửa Ảnh',
};

export function HomePage() {
  const user = useAuthStore((s) => s.user);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Job[]>('/jobs')
      .then(({ data }) => setJobs(data.slice(0, 5)))
      .finally(() => setLoading(false));
  }, []);

  const completed = jobs.filter(j => j.status === 'COMPLETED').length;
  const savedSize = jobs
    .filter(j => j.status === 'COMPLETED' && j.outputFile)
    .reduce((a, j) => a + ((j.inputFile?.size || 0) - ((j.outputFile as { size?: number })?.size || 0)), 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  return (
    <div className="min-h-screen bg-[#f5f5f5]">

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-6 pt-10 pb-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-violet-200 text-sm font-medium mb-1">{greeting},</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">
            {user?.name}
          </h1>
          <p className="text-violet-200 text-sm">Chọn công cụ để bắt đầu xử lý media</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 pb-12 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'Tổng tác vụ', value: String(jobs.length), sub: 'tác vụ đã tạo' },
            { label: 'Hoàn thành', value: String(completed), sub: 'xử lý thành công' },
            { label: 'Đã tiết kiệm', value: formatBytes(savedSize), sub: 'dung lượng' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">{s.label}</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{s.value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tools */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Công cụ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/compress-video"
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-violet-50 group-hover:bg-violet-100 flex items-center justify-center transition-colors shrink-0">
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 group-hover:text-violet-700 transition-colors text-sm">Nén Video</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">Giảm kích thước MP4, AVI, MKV tới 90%</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link to="/edit-image"
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors text-sm">Chỉnh sửa Ảnh</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">Resize, nén, crop và chuyển định dạng</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Recent jobs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Tác vụ gần đây</h2>
            <Link to="/history" className="text-xs text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-1">
              Xem tất cả
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-sm">Chưa có tác vụ nào.</p>
                <p className="text-gray-300 text-xs mt-1">Hãy thử nén video hoặc chỉnh sửa ảnh!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {jobs.map((job) => {
                  const s = STATUS_STYLE[job.status];
                  return (
                    <div key={job.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{job.inputFile.filename}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{TYPE_LABEL[job.type]}</span>
                          <span className="text-gray-200">·</span>
                          <span className="text-xs text-gray-400">{formatBytes(job.inputFile.size)}</span>
                          {job.outputFile && (
                            <>
                              <span className="text-gray-300">→</span>
                              <span className="text-xs text-green-500 font-medium">
                                {formatBytes((job.outputFile as { size?: number })?.size || 0)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
                      </div>

                      {job.status === 'COMPLETED' && (
                        <button onClick={() => downloadJob(job.id)}
                          className="shrink-0 w-7 h-7 rounded-lg bg-gray-50 hover:bg-violet-50 border border-gray-200 hover:border-violet-200 flex items-center justify-center transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-400 hover:text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tip */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
          <div className="w-1 h-full min-h-[40px] bg-violet-500 rounded-full shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Mẹo sử dụng</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Dùng preset <span className="text-gray-600 font-medium">Trung bình</span> để cân bằng giữa chất lượng và kích thước.
              File được lưu trong <span className="text-gray-600 font-medium">7 ngày</span> trước khi tự động xóa.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
