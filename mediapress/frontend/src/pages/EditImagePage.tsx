import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '../services/api';
import type { UploadedFile, Job } from '../types';
import { ProgressBar } from '../components/ProgressBar';

import { downloadJob } from '../utils/download';

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function EditImagePage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState({
    width: '', height: '', quality: '80', format: 'jpeg' as 'jpeg' | 'png' | 'webp',
  });
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<Job['status'] | null>(null);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError(''); setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post<UploadedFile>('/upload/image', form);
      setUploadedFile(data);
    } catch {
      setError('Upload thất bại');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'] },
    maxFiles: 1,
    disabled: uploading || !!uploadedFile,
  });

  const handleProcess = async () => {
    if (!uploadedFile) return;
    setError(''); setJobStatus('PENDING');
    try {
      const { data } = await api.post('/jobs/edit-image', {
        fileId: uploadedFile.id,
        settings: {
          width: settings.width ? parseInt(settings.width) : undefined,
          height: settings.height ? parseInt(settings.height) : undefined,
          quality: parseInt(settings.quality),
          format: settings.format,
          maintainAspectRatio: true,
        },
      });
      setJobId(data.jobId);
      pollJob(data.jobId);
    } catch {
      setError('Lỗi xử lý ảnh');
      setJobStatus(null);
    }
  };

  const pollJob = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get<Job>(`/jobs/${id}`);
        if (data.status === 'COMPLETED') { setJobStatus('COMPLETED'); clearInterval(interval); }
        if (data.status === 'FAILED') { setError(data.errorMessage || 'Lỗi'); setJobStatus('FAILED'); clearInterval(interval); }
      } catch { clearInterval(interval); }
    }, 1500);
  };

  const handleReset = () => {
    setUploadedFile(null); setJobId(null); setJobStatus(null); setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">🖼️ Chỉnh sửa Ảnh</h1>
          <p className="text-gray-500 text-sm mt-1">Resize, nén và chuyển đổi định dạng ảnh</p>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 p-3 rounded-lg">{error}</p>
        )}

        {!uploadedFile && !uploading && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'}`}
          >
            <input {...getInputProps()} />
            <p className="text-3xl sm:text-4xl mb-3">🖼️</p>
            <p className="text-gray-700 font-medium text-sm sm:text-base">
              {isDragActive ? 'Thả ảnh vào đây...' : 'Kéo thả ảnh hoặc nhấn để chọn'}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">JPG, PNG, WebP, GIF — tối đa 50MB</p>
          </div>
        )}

        {uploading && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm">
            <ProgressBar progress={100} label="Đang upload" />
          </div>
        )}

        {uploadedFile && !jobStatus && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">File đã chọn</p>
                <p className="font-semibold text-gray-800 truncate">{uploadedFile.filename}</p>
                <p className="text-sm text-gray-500 mt-0.5">{formatBytes(uploadedFile.size)}</p>
              </div>
              <button onClick={handleReset} className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0">
                ✕ Đổi file
              </button>
            </div>

            {/* Resize inputs — stack on mobile, 2 cols on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1.5">Chiều rộng (px)</label>
                <input type="number" placeholder="Giữ nguyên" value={settings.width}
                  onChange={(e) => setSettings((s) => ({ ...s, width: e.target.value }))}
                  className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1.5">Chiều cao (px)</label>
                <input type="number" placeholder="Giữ nguyên" value={settings.height}
                  onChange={(e) => setSettings((s) => ({ ...s, height: e.target.value }))}
                  className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1.5">
                  Chất lượng: {settings.quality}%
                </label>
                <input type="range" min="10" max="100" value={settings.quality}
                  onChange={(e) => setSettings((s) => ({ ...s, quality: e.target.value }))}
                  className="w-full accent-blue-500 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1.5">Định dạng output</label>
                <select value={settings.format}
                  onChange={(e) => setSettings((s) => ({ ...s, format: e.target.value as 'jpeg' | 'png' | 'webp' }))}
                  className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-base"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            </div>

            <button onClick={handleProcess}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-colors"
            >
              Xử lý ảnh
            </button>
          </div>
        )}

        {(jobStatus === 'PENDING' || jobStatus === 'PROCESSING') && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-3">Đang xử lý ảnh...</p>
            <ProgressBar progress={50} label="Tiến độ" />
          </div>
        )}

        {jobStatus === 'COMPLETED' && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-green-200 shadow-sm text-center space-y-4">
            <p className="text-green-600 text-lg font-semibold">✅ Xử lý hoàn thành!</p>
            <button onClick={() => downloadJob(jobId!)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              Tải xuống
            </button>
            <button onClick={handleReset} className="block mx-auto text-sm text-gray-400 hover:text-gray-600">
              Xử lý ảnh khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
