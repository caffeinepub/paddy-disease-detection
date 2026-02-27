import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Disease } from '../backend';

export type DetectionResult =
  | { kind: 'disease'; disease: Disease }
  | { kind: 'invalid' };

// Deterministically pick a disease index (1–5) based on image content hash
function pickDiseaseIndex(base64Image: string): number {
  let hash = 0;
  const sample = base64Image.slice(0, 500);
  for (let i = 0; i < sample.length; i++) {
    hash = (hash * 31 + sample.charCodeAt(i)) >>> 0;
  }
  return (hash % 5) + 1; // returns 1, 2, 3, 4, or 5
}

/**
 * Analyzes image pixel data to determine if it looks like a plant/leaf image.
 * Returns true if the image has sufficient green-channel dominance (plant-like).
 */
function checkIsLeafImage(base64Image: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    // Reconstruct full data URL (base64 may or may not have prefix)
    const src = base64Image.startsWith('data:')
      ? base64Image
      : `data:image/jpeg;base64,${base64Image}`;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        // Sample a smaller version for performance
        const maxDim = 100;
        const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width = Math.max(1, Math.floor(img.width * scale));
        canvas.height = Math.max(1, Math.floor(img.height * scale));

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(true); // Can't check, allow through
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let greenDominantPixels = 0;
        let totalPixels = 0;
        let totalGreen = 0;
        let totalRed = 0;
        let totalBlue = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Skip transparent pixels
          if (a < 128) continue;

          totalPixels++;
          totalRed += r;
          totalGreen += g;
          totalBlue += b;

          // A pixel is "green dominant" if green channel is notably higher than red and blue
          // and has some minimum brightness (not just dark pixels)
          const brightness = (r + g + b) / 3;
          if (brightness > 20 && g > r * 1.05 && g > b * 1.05) {
            greenDominantPixels++;
          }
        }

        if (totalPixels === 0) {
          resolve(true);
          return;
        }

        const greenRatio = greenDominantPixels / totalPixels;
        const avgGreen = totalGreen / totalPixels;
        const avgRed = totalRed / totalPixels;
        const avgBlue = totalBlue / totalPixels;

        // Image is considered a leaf/plant if:
        // - At least 15% of pixels are green-dominant, OR
        // - The average green channel is meaningfully higher than red and blue
        const hasGreenDominance = greenRatio >= 0.15;
        const hasGreenAvgDominance = avgGreen > avgRed * 1.08 && avgGreen > avgBlue * 1.08;

        resolve(hasGreenDominance || hasGreenAvgDominance);
      } catch {
        resolve(true); // On any error, allow through
      }
    };

    img.onerror = () => {
      resolve(true); // On load error, allow through
    };

    img.src = src;
  });
}

export function useDetectDisease() {
  const { actor } = useActor();

  return useMutation<DetectionResult, Error, string>({
    mutationFn: async (base64Image: string) => {
      if (!actor) throw new Error('Backend not available');

      // First, check if the image looks like a plant/leaf
      const isLeaf = await checkIsLeafImage(base64Image);
      if (!isLeaf) {
        return { kind: 'invalid' };
      }

      const diseaseIndex = pickDiseaseIndex(base64Image);
      const result = await actor.simulateDetection(base64Image, diseaseIndex);
      if (result === null || result === undefined) {
        return { kind: 'invalid' };
      }
      const disease = await actor.getDisease(result);
      return { kind: 'disease', disease };
    },
  });
}
