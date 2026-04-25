interface Props {
  size?: number;
}

const FACES = [
  {
    transform: (h: number) => `rotateY(0deg) translateZ(${h}px)`,
    bg: 'linear-gradient(135deg,#a78bfa,#8b5cf6)',
    icon: (s: number) => (
      <svg width={s*0.44} height={s*0.44} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
  },
  {
    transform: (h: number) => `rotateY(180deg) translateZ(${h}px)`,
    bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
    icon: (s: number) => (
      <svg width={s*0.44} height={s*0.44} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    transform: (h: number) => `rotateY(90deg) translateZ(${h}px)`,
    bg: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
    icon: (s: number) => (
      <svg width={s*0.44} height={s*0.44} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    transform: (h: number) => `rotateY(-90deg) translateZ(${h}px)`,
    bg: 'linear-gradient(135deg,#6d28d9,#5b21b6)',
    icon: (s: number) => (
      <svg width={s*0.44} height={s*0.44} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
  },
  {
    transform: (h: number) => `rotateX(90deg) translateZ(${h}px)`,
    bg: 'linear-gradient(135deg,#c4b5fd,#a78bfa)',
    icon: (s: number) => (
      <svg width={s*0.44} height={s*0.44} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
  },
  {
    transform: (h: number) => `rotateX(-90deg) translateZ(${h}px)`,
    bg: 'linear-gradient(135deg,#5b21b6,#4c1d95)',
    icon: (s: number) => (
      <svg width={s*0.44} height={s*0.44} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
];

export function LogoCube({ size = 36 }: Props) {
  const half = size / 2;
  // Small radius relative to size — enough to look soft but faces still meet
  const r = Math.max(2, Math.round(size * 0.08));

  return (
    <>
      <div style={{ width: size, height: size, perspective: size * 5, display: 'inline-block', flexShrink: 0 }}>
        <div style={{
          width: size, height: size,
          position: 'relative',
          transformStyle: 'preserve-3d',
          animation: 'logoSpin 9s ease-in-out infinite',
        }}>
          {FACES.map((face, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size, height: size,
              background: face.bg,
              borderRadius: r,
              transform: face.transform(half),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // Clip overflow so rounded corners don't bleed
              overflow: 'hidden',
            }}>
              {face.icon(size)}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes logoSpin {
          0%   { transform: rotateX(0deg)   rotateY(0deg); }
          14%  { transform: rotateX(-22deg) rotateY(90deg); }
          28%  { transform: rotateX(18deg)  rotateY(180deg); }
          42%  { transform: rotateX(-18deg) rotateY(270deg); }
          57%  { transform: rotateX(22deg)  rotateY(360deg); }
          71%  { transform: rotateX(-14deg) rotateY(450deg); }
          85%  { transform: rotateX(14deg)  rotateY(540deg); }
          100% { transform: rotateX(0deg)   rotateY(720deg); }
        }
      `}</style>
    </>
  );
}
