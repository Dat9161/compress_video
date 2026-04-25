export function AuthVisual() {
  return (
    <div className="hidden lg:flex flex-1 bg-gray-50 items-center justify-center">
      <div className="text-center px-12 max-w-sm">

        {/* Cube animation */}
        <div className="flex justify-center mb-10" style={{ perspective: '600px' }}>
          <div style={{
            width: 100,
            height: 100,
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: 'rotateCube 6s linear infinite',
          }}>
            {[
              { transform: 'rotateY(0deg) translateZ(50px)',    bg: '#a78bfa' },
              { transform: 'rotateY(180deg) translateZ(50px)',  bg: '#7c3aed' },
              { transform: 'rotateY(90deg) translateZ(50px)',   bg: '#8b5cf6' },
              { transform: 'rotateY(-90deg) translateZ(50px)',  bg: '#6d28d9' },
              { transform: 'rotateX(90deg) translateZ(50px)',   bg: '#c4b5fd' },
              { transform: 'rotateX(-90deg) translateZ(50px)',  bg: '#5b21b6' },
            ].map((face, i) => (
              <div key={i} style={{
                position: 'absolute', width: 100, height: 100,
                background: face.bg,
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 12,
                transform: face.transform,
              }} />
            ))}
          </div>
        </div>

        {/* Tagline */}
        <h2 className="text-2xl font-black text-gray-900 mb-3">
          Nén & Chỉnh sửa<br />Media trực tuyến
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-10">
          Xử lý video và ảnh chuyên nghiệp ngay trên trình duyệt. Không cần cài đặt, hoàn toàn miễn phí.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-8">
          {[
            { value: '90%', label: 'Giảm kích thước' },
            { value: '< 1s', label: 'Xử lý nhanh' },
            { value: '100%', label: 'Miễn phí' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rotateCube {
          from { transform: rotateX(-15deg) rotateY(0deg); }
          to   { transform: rotateX(-15deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
