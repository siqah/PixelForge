import { ImageFormat, Skia } from '@shopify/react-native-skia';
import * as FileSystem from 'expo-file-system/legacy';
import { Filter } from '../constants/filters';
import { AdjustmentState, buildColorMatrix } from './colorMatrix';

export interface RenderOptions {
  sourceUri: string;
  adjustments: AdjustmentState;
  filter: Filter | null;
}

export async function renderImageWithAdjustments({
  sourceUri,
  adjustments,
  filter,
}: RenderOptions): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(sourceUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const imageData = Skia.Data.fromBase64(base64);
  if (!imageData) {
    throw new Error('Failed to load source image data.');
  }

  const skImage = Skia.Image.MakeImageFromEncoded(imageData);
  imageData.dispose?.();
  if (!skImage) {
    throw new Error('Unable to decode image for processing.');
  }

  const width = skImage.width();
  const height = skImage.height();
  const surface = Skia.Surface.Make(width, height);

  if (!surface) {
    skImage.dispose?.();
    throw new Error('Failed to create render surface.');
  }

  const canvas = surface.getCanvas();
  canvas.clear(Skia.Color('transparent'));

  const paint = Skia.Paint();
  const matrix = buildColorMatrix(adjustments, filter);
  paint.setColorFilter(Skia.ColorFilter.MakeMatrix(matrix));

  canvas.drawImageRect(
    skImage,
    { x: 0, y: 0, width, height },
    { x: 0, y: 0, width, height },
    paint,
  );

  if (filter?.tintColor) {
    const tintPaint = Skia.Paint();
    tintPaint.setColor(Skia.Color(filter.tintColor));
    canvas.drawRect({ x: 0, y: 0, width, height }, tintPaint);
  }

  const finalImage = surface.makeImageSnapshot();
  const outputBase64 = finalImage.encodeToBase64(ImageFormat.JPEG, 90);
  const cacheDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!cacheDir) {
    throw new Error('No writable directory available for saving.');
  }
  const outputUri = `${cacheDir}PixelForge-${Date.now()}.jpg`;

  await FileSystem.writeAsStringAsync(outputUri, outputBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  finalImage.dispose?.();
  surface.dispose?.();
  skImage.dispose?.();

  return outputUri;
}
