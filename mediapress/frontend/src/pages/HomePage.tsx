import { Link } from 'react-router-dom';

const tools = [
  { to: '/compress-video', icon: '🎬', title: 'Nén Video', desc: 'Giảm kích thước video MP4, AVI, MKV... nhanh chóng' },
  { to: '/edit-image', icon: '🖼️', title: 'Chỉnh sửa Ảnh', desc: 'Resize, nén, chuyển định dạng ảnh dễ dàng' },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Xin chào 👋</h1>
          <p className="text-gray-500 text-sm sm:text-base">Xử lý video và ảnh trực tuyến, không cần cài phần mềm.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {tools.map((t) => (
            <Link key={t.to} to={t.to}
              className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl p-5 sm:p-6 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <div className="text-3xl sm:text-4xl mb-3">{t.icon}</div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{t.title}</h2>
              <p className="text-gray-500 text-sm">{t.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
