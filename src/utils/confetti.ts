import confetti from "canvas-confetti";

/**
 * Palettes tailored for Islamic Financial Literacy & Halal Excellence:
 * Gold, Emerald Green, Cyan, Warm Amber, Crisp White
 */
const CELEBRATION_COLORS = [
  "#10B981", // Emerald 500
  "#F59E0B", // Amber 500
  "#FBBF24", // Amber 400
  "#06B6D4", // Cyan 500
  "#34D399", // Emerald 400
  "#FCD34D", // Gold 300
  "#FFFFFF", // Crisp White
];

let lastModulesCompletedTime = 0;
let lastExamPassedTime = 0;

/**
 * Fires a dual-cannon celebration when the user completes all curriculum modules (4/4, 7 JP).
 */
export const triggerAllModulesCompletedConfetti = () => {
  const now = Date.now();
  if (now - lastModulesCompletedTime < 2500) return;
  lastModulesCompletedTime = now;

  try {
    const end = now + 1600;

    // Dual-cannon bursts from bottom left and right
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.75 },
        colors: CELEBRATION_COLORS,
        zIndex: 9999,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.75 },
        colors: CELEBRATION_COLORS,
        zIndex: 9999,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Secondary center burst with stars
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: CELEBRATION_COLORS,
        shapes: ["star", "circle"],
        scalar: 1.2,
        zIndex: 9999,
      });
    }, 350);
  } catch (error) {
    console.warn("Confetti effect skipped or unsupported:", error);
  }
};

/**
 * Fires a grand celebratory fireworks effect when the user passes the substantive final exam.
 */
export const triggerExamPassedConfetti = () => {
  const now = Date.now();
  if (now - lastExamPassedTime < 2500) return;
  lastExamPassedTime = now;

  try {
    // Initial high-energy burst
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { x: 0.5, y: 0.6 },
      colors: CELEBRATION_COLORS,
      shapes: ["circle", "star"],
      scalar: 1.2,
      zIndex: 9999,
    });

    // Cascading multi-stage fireworks
    const duration = 2000;
    const animationEnd = now + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      colors: CELEBRATION_COLORS,
    };

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Random bursts across the screen
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.15, 0.4), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.6, 0.85), y: Math.random() - 0.2 },
      });
    }, 250);
  } catch (error) {
    console.warn("Confetti effect skipped or unsupported:", error);
  }
};

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
