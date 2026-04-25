import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

const tools = [
  {
    title: 'Nén Video',
    desc: 'Giảm kích thước video tới 90% mà vẫn giữ chất lượng.',
    to: '/compress-video',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
  },
  {
    title: 'Chỉnh sửa Ảnh',
    desc: 'Resize, nén, crop và chuyển đổi định dạng ảnh.',
    to: '/edit-image',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Cắt Video',
    desc: 'Cắt đoạn video theo thời gian chính xác.',
    to: '/compress-video',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
  },
  {
    title: 'Chuyển định dạng',
    desc: 'Chuyển đổi giữa MP4, WebM, MKV, AVI...',
    to: '/compress-video',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: 'Nén Ảnh',
    desc: 'Giảm dung lượng ảnh JPG, PNG, WebP.',
    to: '/edit-image',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
  },
  {
    title: 'Xử lý hàng loạt',
    desc: 'Xử lý nhiều file cùng lúc, tiết kiệm thời gian.',
    to: '/compress-video',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];


export function LandingPage() {
  const user = useAuthStore((s) => s.user);
  const ctaTo = user ? '/dashboard' : '/register';

  return (
    <div className="bg-[#f5f5f5] min-h-screen">

      {/* Hero */}
      <section className="bg-[#f5f5f5] px-5 pt-16 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="animate-fade-up text-sm font-medium text-gray-500 mb-6 tracking-wide uppercase">
            Miễn phí · Không cần cài đặt
          </p>
          <h1 className="animate-fade-up delay-100 text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-none tracking-tight uppercase mb-6">
            NÉN & CHỈNH SỬA<br />
            <span className="text-violet-600">VIDEO VÀ ẢNH</span><br />
            TRỰC TUYẾN
          </h1>
          <p className="animate-fade-up delay-200 text-gray-500 text-lg max-w-lg mx-auto mb-10">
            Xử lý media chuyên nghiệp ngay trên trình duyệt. Không cần cài phần mềm.
          </p>
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to={ctaTo}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3.5 rounded-full text-base transition-all shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              {user ? 'Vào trang chủ' : 'Bắt đầu miễn phí'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            {!user && (
              <Link to="/login"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-8 py-3.5 rounded-full font-semibold text-base transition-all hover:border-gray-400 hover:shadow-md"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature tabs bar — like veed.io */}
      <section className="bg-white border-y border-gray-200 py-4 overflow-x-auto">
        <div className="flex gap-2 px-5 max-w-7xl mx-auto min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center">
          {['Nén Video', 'Chỉnh sửa Ảnh', 'Cắt Video', 'Chuyển định dạng', 'Nén Ảnh', 'Xử lý hàng loạt'].map((t, i) => (
            <Link key={t} to={i % 2 === 0 ? '/compress-video' : '/edit-image'}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${i === 0 ? 'bg-violet-100 text-violet-700 border border-violet-200' : 'text-gray-600 hover:bg-gray-100 border border-transparent'}`}
            >
              {t}
            </Link>
          ))}
        </div>
      </section>

      {/* App preview mockup */}
      <section className="bg-[#f5f5f5] py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Fake toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 max-w-xs mx-auto" />
            </div>
            {/* Fake editor UI */}
            <div className="flex h-64 sm:h-80">
              <div className="w-12 bg-gray-900 flex flex-col items-center py-4 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-lg bg-gray-700" />
                ))}
              </div>
              <div className="flex-1 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-10 h-10 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Kéo thả file vào đây</p>
                </div>
              </div>
              <div className="w-48 bg-white border-l border-gray-200 p-4 hidden sm:block">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Cài đặt</p>
                {['Chất lượng', 'Định dạng', 'Kích thước'].map(s => (
                  <div key={s} className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">{s}</p>
                    <div className="h-7 bg-gray-100 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
            {/* Timeline bar */}
            <div className="bg-gray-900 h-12 flex items-center px-4 gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-violet-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="bg-[#f5f5f5] py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center uppercase tracking-tight mb-3">
            MỌI THỨ BẠN CẦN,<br />
            <span className="text-violet-600">TẤT CẢ TRONG MỘT NƠI</span>
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-md mx-auto">
            Tạo, chỉnh sửa và chia sẻ media trực tiếp trên trình duyệt.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((t, i) => (
              <Link key={t.title} to={t.to}
                className={`group bg-white rounded-3xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-up delay-${Math.min((i + 1) * 100, 500)}`}
              >
                <div className={`w-12 h-12 ${t.iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <span className={t.iconColor}>{t.icon}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">{t.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white py-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight mb-3">
            CHỈ 3 BƯỚC ĐƠN GIẢN
          </h2>
          <p className="text-gray-500 mb-14">Không cần kiến thức kỹ thuật</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Upload file', desc: 'Kéo thả hoặc chọn video/ảnh từ máy tính' },
              { n: '02', title: 'Chọn cài đặt', desc: 'Chọn mức nén, định dạng hoặc kích thước' },
              { n: '03', title: 'Tải xuống', desc: 'Nhận file đã xử lý ngay lập tức' },
            ].map((s) => (
              <div key={s.n} className="text-left">
                <p className="text-5xl font-black text-gray-100 mb-3">{s.n}</p>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-4">
            SẴN SÀNG BẮT ĐẦU?
          </h2>
          <p className="text-gray-400 mb-8">Tạo tài khoản miễn phí ngay hôm nay.</p>
          <Link to={ctaTo}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-violet-900/30 hover:-translate-y-0.5"
          >
            {user ? 'Vào trang chủ' : 'Bắt đầu miễn phí'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 px-5 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12">
            <div>
              <p className="font-black text-white text-xl mb-2">MediaPress</p>
              <p className="text-gray-500 text-sm max-w-xs">Nén và chỉnh sửa video, ảnh trực tuyến. Miễn phí, không cần cài đặt.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-2">
              {['Nén Video', 'Chỉnh ảnh', 'Lịch sử', 'Đăng nhập', 'Đăng ký'].map(l => (
                <Link key={l} to="/" className="text-gray-500 hover:text-white text-sm transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          {/* Big logo like veed */}
          <div className="border-t border-gray-800 pt-8 flex items-end justify-between">
            <p className="text-gray-600 text-xs">© 2026 MediaPress</p>
            <p className="text-8xl sm:text-9xl font-black text-gray-800 leading-none select-none">MP</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
