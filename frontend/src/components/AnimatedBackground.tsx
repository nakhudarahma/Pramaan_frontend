// Magical floating & shimmering particles distributed across the viewport
const PARTICLES = [
  { id: 1, top: 12, left: 8, size: 4, color: "#38BDF8", dur: 7, delay: -2, anim: 1 },
  { id: 2, top: 22, left: 18, size: 3.5, color: "#ffffff", dur: 9, delay: -5, anim: 2 },
  { id: 3, top: 8, left: 32, size: 5, color: "#7DD3FC", dur: 11, delay: -3, anim: 3 },
  { id: 4, top: 28, left: 45, size: 3.5, color: "#ffffff", dur: 8, delay: -6, anim: 4 },
  { id: 5, top: 15, left: 62, size: 4.5, color: "#38BDF8", dur: 10, delay: -1, anim: 5 },
  { id: 6, top: 25, left: 78, size: 3, color: "#ffffff", dur: 7.5, delay: -4, anim: 1 },
  { id: 7, top: 10, left: 90, size: 4, color: "#7DD3FC", dur: 12, delay: -7, anim: 2 },
  { id: 8, top: 40, left: 12, size: 3.5, color: "#ffffff", dur: 8.5, delay: -3, anim: 3 },
  { id: 9, top: 48, left: 26, size: 5.5, color: "#38BDF8", dur: 10.5, delay: -8, anim: 4 },
  { id: 10, top: 38, left: 52, size: 3, color: "#ffffff", dur: 7, delay: -2, anim: 5 },
  { id: 11, top: 45, left: 68, size: 4.5, color: "#7DD3FC", dur: 9.5, delay: -5, anim: 1 },
  { id: 12, top: 42, left: 85, size: 3.5, color: "#ffffff", dur: 11, delay: -4, anim: 2 },
  { id: 13, top: 58, left: 6, size: 4, color: "#38BDF8", dur: 8, delay: -6, anim: 3 },
  { id: 14, top: 65, left: 22, size: 3.5, color: "#ffffff", dur: 10, delay: -1, anim: 4 },
  { id: 15, top: 62, left: 38, size: 5, color: "#7DD3FC", dur: 12, delay: -7, anim: 5 },
  { id: 16, top: 55, left: 58, size: 3.5, color: "#ffffff", dur: 7.5, delay: -3, anim: 1 },
  { id: 17, top: 68, left: 74, size: 4.5, color: "#38BDF8", dur: 9, delay: -5, anim: 2 },
  { id: 18, top: 60, left: 92, size: 3, color: "#ffffff", dur: 11.5, delay: -8, anim: 3 },
  { id: 19, top: 78, left: 14, size: 4.5, color: "#7DD3FC", dur: 8.5, delay: -2, anim: 4 },
  { id: 20, top: 85, left: 30, size: 3.5, color: "#ffffff", dur: 10, delay: -6, anim: 5 },
  { id: 21, top: 75, left: 48, size: 5, color: "#38BDF8", dur: 7, delay: -4, anim: 1 },
  { id: 22, top: 88, left: 64, size: 3, color: "#ffffff", dur: 11, delay: -7, anim: 2 },
  { id: 23, top: 80, left: 82, size: 4, color: "#7DD3FC", dur: 9.5, delay: -1, anim: 3 },
  { id: 24, top: 92, left: 94, size: 3.5, color: "#ffffff", dur: 8, delay: -5, anim: 4 },
  { id: 25, top: 32, left: 96, size: 4, color: "#38BDF8", dur: 10.5, delay: -3, anim: 5 },
  { id: 26, top: 90, left: 8, size: 3.5, color: "#ffffff", dur: 9, delay: -6, anim: 1 },
  { id: 27, top: 5, left: 50, size: 4.5, color: "#7DD3FC", dur: 11.5, delay: -2, anim: 2 },
  { id: 28, top: 95, left: 42, size: 3, color: "#ffffff", dur: 8.5, delay: -4, anim: 3 },
];

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#EAF4FB] dark:bg-[#0A1424] transition-colors duration-500"
      aria-hidden="true"
    >
      <style>{`
        /* --- Blobs Animations --- */
        @keyframes blobMotion1 {
          0% { transform: translate3d(-24vw, -16vh, 0) scale(1); }
          50% { transform: translate3d(12vw, 14vh, 0) scale(1.12); }
          100% { transform: translate3d(26vw, 18vh, 0) scale(0.92); }
        }

        @keyframes blobMotion2 {
          0% { transform: translate3d(22vw, -18vh, 0) scale(0.94); }
          50% { transform: translate3d(-12vw, 16vh, 0) scale(1.1); }
          100% { transform: translate3d(-24vw, 14vh, 0) scale(1.02); }
        }

        @keyframes blobMotion3 {
          0% { transform: translate3d(-18vw, 18vh, 0) scale(1.06); }
          50% { transform: translate3d(16vw, -12vh, 0) scale(0.92); }
          100% { transform: translate3d(22vw, -18vh, 0) scale(1.08); }
        }

        @keyframes blobMotion4 {
          0% { transform: translate3d(20vw, 15vh, 0) scale(0.95); }
          50% { transform: translate3d(-16vw, -18vh, 0) scale(1.08); }
          100% { transform: translate3d(-22vw, -12vh, 0) scale(1); }
        }

        @keyframes blobMotion5 {
          0% { transform: translate3d(-16vw, -14vh, 0) scale(1.08); }
          50% { transform: translate3d(18vw, 20vh, 0) scale(0.94); }
          100% { transform: translate3d(22vw, -10vh, 0) scale(1.04); }
        }

        @keyframes blobMotion6 {
          0% { transform: translate3d(-22vw, 14vh, 0) scale(0.96); }
          50% { transform: translate3d(14vw, -16vh, 0) scale(1.1); }
          100% { transform: translate3d(24vw, -14vh, 0) scale(0.98); }
        }

        @keyframes blobMotion7 {
          0% { transform: translate3d(16vw, -18vh, 0) scale(1.05); }
          50% { transform: translate3d(-20vw, 12vh, 0) scale(0.95); }
          100% { transform: translate3d(-14vw, 20vh, 0) scale(1.08); }
        }

        .anim-blob-1 { animation: blobMotion1 8s ease-in-out infinite alternate; will-change: transform; }
        .anim-blob-2 { animation: blobMotion2 11s ease-in-out infinite alternate; will-change: transform; }
        .anim-blob-3 { animation: blobMotion3 13s ease-in-out infinite alternate; will-change: transform; }
        .anim-blob-4 { animation: blobMotion4 15s ease-in-out infinite alternate; will-change: transform; }
        .anim-blob-5 { animation: blobMotion5 9s ease-in-out infinite alternate; will-change: transform; }
        .anim-blob-6 { animation: blobMotion6 12s ease-in-out infinite alternate; will-change: transform; }
        .anim-blob-7 { animation: blobMotion7 10s ease-in-out infinite alternate; will-change: transform; }

        /* --- Magical Particle Floating & Twinkling --- */
        @keyframes magicFloat1 {
          0% {
            transform: translate3d(0, 0, 0) scale(0.85);
            opacity: 0.4;
          }
          50% {
            transform: translate3d(22px, -26px, 0) scale(1.25);
            opacity: 0.95;
          }
          100% {
            transform: translate3d(-16px, -38px, 0) scale(0.8);
            opacity: 0.45;
          }
        }

        @keyframes magicFloat2 {
          0% {
            transform: translate3d(0, 0, 0) scale(1.15);
            opacity: 0.9;
          }
          50% {
            transform: translate3d(-26px, 20px, 0) scale(0.75);
            opacity: 0.35;
          }
          100% {
            transform: translate3d(18px, 32px, 0) scale(1.2);
            opacity: 0.95;
          }
        }

        @keyframes magicFloat3 {
          0% {
            transform: translate3d(0, 0, 0) scale(0.8);
            opacity: 0.45;
          }
          50% {
            transform: translate3d(-24px, -18px, 0) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate3d(20px, 24px, 0) scale(0.85);
            opacity: 0.4;
          }
        }

        @keyframes magicFloat4 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.85;
          }
          50% {
            transform: translate3d(22px, 22px, 0) scale(0.7);
            opacity: 0.35;
          }
          100% {
            transform: translate3d(-20px, -18px, 0) scale(1.25);
            opacity: 0.95;
          }
        }

        @keyframes magicFloat5 {
          0% {
            transform: translate3d(0, 0, 0) scale(0.75);
            opacity: 0.4;
          }
          50% {
            transform: translate3d(-18px, -28px, 0) scale(1.3);
            opacity: 1;
          }
          100% {
            transform: translate3d(24px, -12px, 0) scale(0.8);
            opacity: 0.5;
          }
        }

        .magic-particle-1 { animation: magicFloat1 ease-in-out infinite alternate; will-change: transform, opacity; }
        .magic-particle-2 { animation: magicFloat2 ease-in-out infinite alternate; will-change: transform, opacity; }
        .magic-particle-3 { animation: magicFloat3 ease-in-out infinite alternate; will-change: transform, opacity; }
        .magic-particle-4 { animation: magicFloat4 ease-in-out infinite alternate; will-change: transform, opacity; }
        .magic-particle-5 { animation: magicFloat5 ease-in-out infinite alternate; will-change: transform, opacity; }

        /* --- Faint Dot Grid --- */
        .dot-grid-layer {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at 50% 50%, black 35%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at 50% 50%, black 35%, transparent 80%);
        }

        :root:not(.dark) .dot-grid-layer {
          background-image: radial-gradient(circle, rgba(15, 42, 74, 0.06) 1px, transparent 1px) !important;
        }

        /* --- Translucent cards with backdrop-blur-md --- */
        .student-card,
        .shadow-card {
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }

        :root:not(.dark) .student-card,
        :root:not(.dark) .shadow-card {
          background-color: rgba(255, 255, 255, 0.82) !important;
        }

        .dark .student-card,
        .dark .shadow-card {
          background-color: rgba(17, 28, 46, 0.82) !important;
        }

        /* --- Reduced motion support --- */
        @media (prefers-reduced-motion: reduce) {
          .anim-blob-1,
          .anim-blob-2,
          .anim-blob-3,
          .anim-blob-4,
          .anim-blob-5,
          .anim-blob-6,
          .anim-blob-7,
          .magic-particle-1,
          .magic-particle-2,
          .magic-particle-3,
          .magic-particle-4,
          .magic-particle-5 {
            animation: none !important;
          }
        }
      `}</style>

      {/* --- LAYER 1: The 7 floating colorful blobs --- */}
      {/* 1. Sky blue #38BDF8 — Top-left (24vw) */}
      <div
        className="anim-blob-1 absolute top-[10%] left-[8%] w-[24vw] h-[24vw] min-w-[200px] min-h-[200px] max-w-[340px] max-h-[340px] rounded-full bg-[#38BDF8] opacity-50 blur-[55px]"
      />

      {/* 2. Mid blue #2B7FBF — Top-right (28vw) */}
      <div
        className="anim-blob-2 absolute top-[18%] right-[12%] w-[28vw] h-[28vw] min-w-[220px] min-h-[220px] max-w-[380px] max-h-[380px] rounded-full bg-[#2B7FBF] opacity-50 blur-[60px]"
      />

      {/* 3. Electric sky #0EA5E9 — Mid-left (22vw) */}
      <div
        className="anim-blob-3 absolute top-[48%] left-[16%] w-[22vw] h-[22vw] min-w-[180px] min-h-[180px] max-w-[300px] max-h-[300px] rounded-full bg-[#0EA5E9] opacity-50 blur-[50px]"
      />

      {/* 4. Deep navy #1E5F94 — Bottom-right (30vw) */}
      <div
        className="anim-blob-4 absolute bottom-[12%] right-[20%] w-[30vw] h-[30vw] min-w-[240px] min-h-[240px] max-w-[420px] max-h-[420px] rounded-full bg-[#1E5F94] opacity-50 blur-[60px]"
      />

      {/* 5. Soft cornflower #60A5FA — Top-center (20vw) */}
      <div
        className="anim-blob-5 absolute top-[6%] right-[38%] w-[20vw] h-[20vw] min-w-[170px] min-h-[170px] max-w-[280px] max-h-[280px] rounded-full bg-[#60A5FA] opacity-50 blur-[50px]"
      />

      {/* 6. Azure #0284C7 — Bottom-left (26vw) */}
      <div
        className="anim-blob-6 absolute bottom-[10%] left-[6%] w-[26vw] h-[26vw] min-w-[210px] min-h-[210px] max-w-[360px] max-h-[360px] rounded-full bg-[#0284C7] opacity-50 blur-[55px]"
      />

      {/* 7. Bright cyan #38BDF8 — Mid-right (18vw) */}
      <div
        className="anim-blob-7 absolute top-[42%] right-[6%] w-[18vw] h-[18vw] min-w-[150px] min-h-[150px] max-w-[260px] max-h-[260px] rounded-full bg-[#38BDF8] opacity-55 blur-[45px]"
      />

      {/* --- LAYER 2: Faint dot grid (1px dots, 32px spacing, edge fade) --- */}
      <div className="absolute inset-0 dot-grid-layer" />

      {/* --- LAYER 3: Magical Shimmering Particles all over the background --- */}
      {PARTICLES.map((p) => {
        const glowColor =
          p.color === "#ffffff"
            ? "rgba(255, 255, 255, 0.95)"
            : "rgba(56, 189, 248, 0.95)";
        return (
          <div
            key={p.id}
            className={`magic-particle-${p.anim} absolute rounded-full`}
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${glowColor}, 0 0 ${p.size * 4}px ${glowColor}`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
