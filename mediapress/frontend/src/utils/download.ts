import { api } from '../services/api';

export async function downloadJob(jobId: string, filename?: string) {
  const response = await api.get(`/download/${jobId}`, { responseType: 'blob' });

  // Lấy tên file từ header nếu có
  const disposition = response.headers['content-disposition'];
  let name = filename || 'output';
  if (disposition) {
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match?.[1]) name = match[1].replace(/['"]/g, '');
  }

  const url = URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
