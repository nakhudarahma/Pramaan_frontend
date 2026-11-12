import confetti from "canvas-confetti";

type BurstOptions = NonNullable<Parameters<typeof confetti>[0]>;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

export function burstConfetti(options: BurstOptions = {}) {
  if (prefersReducedMotion()) return;

  confetti({
    particleCount: 35,
    spread: 55,
    startVelocity: 24,
    scalar: 0.7,
    ticks: 110,
    zIndex: 80,
    colors: ["#0f2a4a", "#38bdf8", "#22c55e", "#f59e0b"],
    disableForReducedMotion: true,
    ...options,
  });
}

export function celebrateVerified() {
  burstConfetti({
    origin: { x: 0.5, y: 0.62 },
    particleCount: 32,
    spread: 50,
  });
}

export function celebratePublish() {
  burstConfetti({
    origin: { x: 0.5, y: 0.72 },
    particleCount: 90,
    spread: 75,
    startVelocity: 32,
    scalar: 0.9,
  });
}
