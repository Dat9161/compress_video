import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '../services/api';
import type { UploadedFile, Job } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { downloadJob } from '../utils/download';

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
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
  const [outputSize, setOutputSize] = useState<number | null>(null);
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
    } catch { setError('Upload thất bại'); }
    finally { setUploading(false); }
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
    } catch { setError('Lỗi xử lý ảnh'); setJobStatus(null); }
  };

  const pollJob = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get<Job>(`/jobs/${id}`);
        setJobStatus(data.status);
        if (data.status === 'COMPLETED') {
          setOutputSize((data.outputFile as { size?: number })?.size || null);
          clearInterval(interval);
        }
        if (data.status === 'FAILED') { setError(data.errorMessage || 'Lỗi'); clearInterval(interval); }
      } catch { clearInterval(interval); }
    }, 800);
  };

  const handleReset = () => {
    setUploadedFile(null); setJobId(null); setJobStatus(null); setError(''); setOutputSize(null);
  };

  const savedPercent = uploadedFile && outputSize
    ? Math.round((1 - outputSize / uploadedFile.size) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 px-4 py-8 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Chỉnh sửa Ảnh</h1>
          <p className="text-gray-500 text-sm mt-1">Resize, nén và chuyển đổi định dạng ảnh</p>
        </div>

        {error && (
          <div className="animate-fade-in text-red-600 text-sm mb-5 bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {!uploadedFile && !uploading && (
          <div
            {...getRootProps()}
            className={`animate-fade-in border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300
              ${isDragActive
                ? 'border-purple-500 bg-purple-50 scale-[1.02]'
                : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg'}`}
          >
            <input {...getInputProps()} />
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors ${isDragActive ? 'bg-purple-100' : 'bg-gray-100'}`}>
              <svg className={`w-8 h-8 ${isDragActive ? 'text-purple-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold text-base">
              {isDragActive ? 'Thả ảnh vào đây...' : 'Kéo thả ảnh hoặc nhấn để chọn'}
            </p>
            <p className="text-gray-400 text-sm mt-2">JPG, PNG, WebP, GIF — tối đa 50MB</p>
          </div>
        )}

        {uploading && (
          <div className="animate-fade-in bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <ProgressBar progress={100} label="Đang upload" />
          </div>
        )}

        {uploadedFile && !jobStatus && (
          <div className="animate-slide-up bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
            {/* File info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 truncate">{uploadedFile.filename}</p>
                <p className="text-sm text-gray-400 mt-0.5">{formatBytes(uploadedFile.size)}</p>
              </div>
              <button onClick={handleReset} className="text-gray-300 hover:text-red-400 transition-colors p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">Chiều rộng (px)</label>
                <input type="number" placeholder="Giữ nguyên" value={settings.width}
                  onChange={(e) => setSettings((s) => ({ ...s, width: e.target.value }))}
                  className="w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">Chiều cao (px)</label>
                <input type="number" placeholder="Giữ nguyên" value={settings.height}
                  onChange={(e) => setSettings((s) => ({ ...s, height: e.target.value }))}
                  className="w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">
                  Chất lượng: <span className="text-purple-600">{settings.quality}%</span>
                </label>
                <input type="range" min="10" max="100" value={settings.quality}
                  onChange={(e) => setSettings((s) => ({ ...s, quality: e.target.value }))}
                  className="w-full accent-purple-500 mt-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">Định dạng output</label>
                <select value={settings.format}
                  onChange={(e) => setSettings((s) => ({ ...s, format: e.target.value as 'jpeg' | 'png' | 'webp' }))}
                  className="w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 transition-all"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP (nhỏ nhất)</option>
                </select>
              </div>
            </div>

            <button onClick={handleProcess}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3.5 rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Xử lý ảnh
            </button>
          </div>
        )}

        {(jobStatus === 'PENDING' || jobStatus === 'PROCESSING') && (
          <div className="animate-fade-in bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-600">Đang xử lý ảnh...</p>
            </div>
            <ProgressBar progress={50} label="Tiến độ" />
          </div>
        )}

        {jobStatus === 'COMPLETED' && (
          <div className="animate-slide-up bg-white rounded-3xl p-8 border border-green-200 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-green-600 text-xl font-bold">Xử lý hoàn thành!</p>
              {savedPercent !== null && savedPercent > 0 && (
                <p className="text-gray-500 text-sm mt-1">
                  Giảm <span className="font-semibold text-green-600">{savedPercent}%</span> kích thước
                  ({formatBytes(uploadedFile!.size)} → {formatBytes(outputSize!)})
                </p>
              )}
            </div>
            <button onClick={() => downloadJob(jobId!)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Tải xuống
            </button>
            <button onClick={handleReset} className="block mx-auto text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Xử lý ảnh khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
