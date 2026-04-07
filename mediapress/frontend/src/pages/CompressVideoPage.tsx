import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '../services/api';
import type { UploadedFile, CompressPreset, Job } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { downloadJob } from '../utils/download';

const PRESETS: { value: CompressPreset; label: string; desc: string }[] = [
  { value: 'low',    label: 'Thấp',       desc: '~480p · 500kbps' },
  { value: 'medium', label: 'Trung bình', desc: '~720p · 1Mbps' },
  { value: 'high',   label: 'Cao',        desc: '~1080p · 2.5Mbps' },
];

function formatBytes(bytes: number) {
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
    setError(''); setJobStatus('PENDING');
    try {
      const { data } = await api.post('/jobs/compress-video', { fileId: uploadedFile.id, settings: { preset } });
      setJobId(data.jobId);
      setJobStatus('PROCESSING');
      pollJob(data.jobId);  // poll thay vì WebSocket
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Lỗi tạo job');
      setJobStatus(null);
    }
  };

  const pollJob = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get<Job>(`/jobs/${id}`);
        setJobProgress(data.progress);
        if (data.status === 'COMPLETED') { setJobStatus('COMPLETED'); clearInterval(interval); }
        if (data.status === 'FAILED') { setError(data.errorMessage || 'Lỗi xử lý'); setJobStatus('FAILED'); clearInterval(interval); }
      } catch { clearInterval(interval); }
    }, 2000);
  };


  const handleReset = () => {
    setUploadedFile(null); setJobId(null); setJobStatus(null);
    setJobProgress(0); setUploadProgress(0); setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">🎬 Nén Video</h1>
          <p className="text-gray-500 text-sm mt-1">Giảm kích thước video mà không mất nhiều chất lượng</p>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 p-3 rounded-lg">{error}</p>
        )}

        {/* Upload zone */}
        {!uploadedFile && !uploading && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'}`}
          >
            <input {...getInputProps()} />
            <p className="text-3xl sm:text-4xl mb-3">📁</p>
            <p className="text-gray-700 font-medium text-sm sm:text-base">
              {isDragActive ? 'Thả file vào đây...' : 'Kéo thả video hoặc nhấn để chọn'}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">MP4, AVI, MOV, MKV, WebM — tối đa 2GB</p>
          </div>
        )}

        {uploading && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm">
            <ProgressBar progress={uploadProgress} label="Đang upload" />
          </div>
        )}

        {/* File info + settings */}
        {uploadedFile && !jobStatus && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">File đã chọn</p>
                <p className="font-semibold text-gray-800 truncate">{uploadedFile.filename}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {formatBytes(uploadedFile.size)}
                  {uploadedFile.metadata?.width && ` · ${uploadedFile.metadata.width}×${uploadedFile.metadata.height}`}
                  {uploadedFile.metadata?.duration && ` · ${Math.round(uploadedFile.metadata.duration)}s`}
                </p>
              </div>
              <button onClick={handleReset} className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0">
                ✕ Đổi file
              </button>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Chọn mức nén</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {PRESETS.map((p) => (
                  <button key={p.value} onClick={() => setPreset(p.value)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all
                      ${preset === p.value
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-gray-200 bg-gray-50 hover:border-blue-300'}`}
                  >
                    <p className="font-semibold text-xs sm:text-sm text-gray-800">{p.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleCompress}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-colors"
            >
              Bắt đầu nén
            </button>
          </div>
        )}

        {(jobStatus === 'PENDING' || jobStatus === 'PROCESSING') && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-3">Đang xử lý video...</p>
            <ProgressBar progress={jobProgress} label="Tiến độ" />
          </div>
        )}

        {jobStatus === 'COMPLETED' && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-green-200 shadow-sm text-center space-y-4">
            <p className="text-green-600 text-lg font-semibold">✅ Nén hoàn thành!</p>
            <button onClick={() => downloadJob(jobId!)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              Tải xuống
            </button>
            <button onClick={handleReset} className="block mx-auto text-sm text-gray-400 hover:text-gray-600">
              Nén video khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
