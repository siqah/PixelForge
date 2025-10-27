import { Filter } from '../constants/filters';

export interface AdjustmentState {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
}

const IDENTITY_MATRIX = [
  1, 0, 0, 0, 0,
  0, 1, 0, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 0, 1, 0,
];

export function buildColorMatrix(
  adjustments: AdjustmentState,
  filter: Filter | null,
): number[] {
  const finalBrightness = adjustments.brightness + (filter?.brightness ?? 0);
  const finalContrast = adjustments.contrast * (filter?.contrast ?? 1);
  const finalSaturation = adjustments.saturation * (filter?.saturation ?? 1);

  let matrix = [...IDENTITY_MATRIX];

  const s = finalSaturation;
  const saturationMatrix = [
    0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s, 0, 0,
    0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s, 0, 0,
    0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s, 0, 0,
    0, 0, 0, 1, 0,
  ];
  matrix = multiplyColorMatrices(matrix, saturationMatrix);

  const c = finalContrast;
  const contrastOffset = 0.5 * (1 - c);
  const contrastMatrix = [
    c, 0, 0, 0, contrastOffset,
    0, c, 0, 0, contrastOffset,
    0, 0, c, 0, contrastOffset,
    0, 0, 0, 1, 0,
  ];
  matrix = multiplyColorMatrices(matrix, contrastMatrix);

  const b = finalBrightness;
  const brightnessMatrix = [
    1, 0, 0, 0, b,
    0, 1, 0, 0, b,
    0, 0, 1, 0, b,
    0, 0, 0, 1, 0,
  ];
  matrix = multiplyColorMatrices(matrix, brightnessMatrix);

  if (adjustments.temperature !== 0) {
    const temp = adjustments.temperature * 0.1;
    const temperatureMatrix = [
      1 + temp, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 1 - temp, 0, 0,
      0, 0, 0, 1, 0,
    ];
    matrix = multiplyColorMatrices(matrix, temperatureMatrix);
  }

  if (adjustments.tint !== 0) {
    const tintValue = adjustments.tint * 0.1;
    const tintMatrix = [
      1, 0, 0, 0, 0,
      0, 1 + tintValue, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 0, 1, 0,
    ];
    matrix = multiplyColorMatrices(matrix, tintMatrix);
  }

  return matrix;
}

export function multiplyColorMatrices(a: number[], b: number[]): number[] {
  const result = new Array(20).fill(0);

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      if (col === 4) {
        result[row * 5 + col] = a[row * 5 + col] + b[row * 5 + col];
      } else {
        result[row * 5 + col] =
          a[row * 5 + 0] * b[0 * 5 + col] +
          a[row * 5 + 1] * b[1 * 5 + col] +
          a[row * 5 + 2] * b[2 * 5 + col] +
          a[row * 5 + 3] * b[3 * 5 + col];
      }
    }
  }

  return result;
}
