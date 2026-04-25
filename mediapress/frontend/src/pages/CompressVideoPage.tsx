import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '../services/api';
import type { UploadedFile, CompressPreset, Job } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { downloadJob } from '../utils/download';

const PRESETS: { value: CompressPreset; label: string; desc: string; color: string }[] = [
  { value: 'low',    label: 'Nhỏ nhất',    desc: '~480p · 500kbps', color: 'border-green-300 bg-green-50' },
  { value: 'medium', label: 'Cân bằng',    desc: '~720p · 1Mbps',   color: 'border-blue-300 bg-blue-50' },
  { value: 'high',   label: 'Chất lượng',  desc: '~1080p · 2.5Mbps',color: 'border-purple-300 bg-purple-50' },
];

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function CompressVideoPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preset, setPreset] = useState<CompressPreset>('medium');
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobProgress, setJobProgress] = useState(0);
  const [jobStatus, setJobStatus] = useState<Job['status'] | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError(''); setUploading(true); setUploadProgress(0);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post<UploadedFile>('/upload/video', form, {
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded / (e.total || 1)) * 100)),
      });
      setUploadedFile(data);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm'] },
    maxFiles: 1,
    disabled: uploading || !!uploadedFile,
  });

  const handleCompress = async () => {
    if (!uploadedFile) return;
    setError(''); setJobStatus('PENDING'); setJobProgress(0);
    try {
      const { data } = await api.post('/jobs/compress-video', { fileId: uploadedFile.id, settings: { preset } });
      setJobId(data.jobId);
      setJobStatus('PROCESSING');
      pollJob(data.jobId);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Lỗi tạo job');
      setJobStatus(null);
    }
  };

  const pollJob = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get<Job>(`/jobs/${id}`);
        setJobProgress(data.progress || 0);
        setJobStatus(data.status);
        if (data.status === 'COMPLETED') {
          setOutputSize((data.outputFile as { size?: number })?.size || null);
          clearInterval(interval);
        }
        if (data.status === 'FAILED') {
          setError(data.errorMessage || 'Lỗi xử lý');
          clearInterval(interval);
        }
      } catch { clearInterval(interval); }
    }, 800);
  };

  const handleReset = () => {
    setUploadedFile(null); setJobId(null); setJobStatus(null);
    setJobProgress(0); setUploadProgress(0); setError(''); setOutputSize(null);
  };

  const savedPercent = uploadedFile && outputSize
    ? Math.round((1 - outputSize / uploadedFile.size) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Nén Video</h1>
          <p className="text-gray-500 text-sm mt-1">Giảm kích thước video mà không mất nhiều chất lượng</p>
        </div>

        {error && (
          <div className="animate-fade-in text-red-600 text-sm mb-5 bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Upload zone */}
        {!uploadedFile && !uploading && (
          <div
            {...getRootProps()}
            className={`animate-fade-in border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300
              ${isDragActive
                ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg'}`}
          >
            <input {...getInputProps()} />
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <svg className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold text-base">
              {isDragActive ? 'Thả video vào đây...' : 'Kéo thả video hoặc nhấn để chọn'}
            </p>
            <p className="text-gray-400 text-sm mt-2">MP4, AVI, MOV, MKV, WebM — tối đa 2GB</p>
          </div>
        )}

        {uploading && (
          <div className="animate-fade-in bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-3">Đang upload...</p>
            <ProgressBar progress={uploadProgress} label="Upload" />
          </div>
        )}

        {/* File info + settings */}
        {uploadedFile && !jobStatus && (
          <div className="animate-slide-up bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
            {/* File info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 truncate">{uploadedFile.filename}</p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {formatBytes(uploadedFile.size)}
                  {uploadedFile.metadata?.width && ` · ${uploadedFile.metadata.width}×${uploadedFile.metadata.height}`}
                  {uploadedFile.metadata?.duration && ` · ${Math.round(uploadedFile.metadata.duration)}s`}
                </p>
              </div>
              <button onClick={handleReset} className="text-gray-300 hover:text-red-400 transition-colors p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preset */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Chọn mức nén</p>
              <div className="grid grid-cols-3 gap-3">
                {PRESETS.map((p) => (
                  <button key={p.value} onClick={() => setPreset(p.value)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all duration-200
                      ${preset === p.value
                        ? `${p.color} ring-2 ring-offset-1 ring-blue-400 shadow-md`
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-sm'}`}
                  >
                    <p className="font-semibold text-sm text-gray-800">{p.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleCompress}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Bắt đầu nén
            </button>
          </div>
        )}

        {/* Processing */}
        {(jobStatus === 'PENDING' || jobStatus === 'PROCESSING') && (
          <div className="animate-fade-in bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-600">Đang xử lý video...</p>
            </div>
            <ProgressBar progress={jobProgress} label="Tiến độ" />
          </div>
        )}

        {/* Completed */}
        {jobStatus === 'COMPLETED' && (
          <div className="animate-slide-up bg-white rounded-3xl p-8 border border-green-200 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-green-600 text-xl font-bold">Nén hoàn thành!</p>
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
              Nén video khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
