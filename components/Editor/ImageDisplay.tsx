import { Canvas, ColorMatrix, Group, Rect, Image as SkiaImage, Text as SkiaText, useFont, useImage } from '@shopify/react-native-skia';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Filter } from '../../constants/filters';
import { buildColorMatrix } from '../../utils/colorMatrix';

// Professional color palette
const COLORS = {
  background: '#0A0A0A',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  primary: '#0A84FF',
  overlay: 'rgba(0, 0, 0, 0.75)',
};

interface ImageDisplayProps {
  uri: string;
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  filter: Filter | null;
  showIndicators?: boolean;
  textLayers?: Array<{
    text: string;
    color: string;
    fontSize: number;
    opacity: number;
    x?: number;
    y?: number;
  }>;
}

export default function ImageDisplay({ 
  uri, 
  brightness, 
  contrast, 
  saturation, 
  temperature, 
  tint, 
  filter,
  showIndicators = true,
  textLayers = []
}: ImageDisplayProps) {
  // Load image with Skia
  const skiaImage = useImage(uri);
  
  // Load fonts for different sizes
  const font24 = useFont(require('../../assets/fonts/Inter-Bold.ttf'), 24);
  const font32 = useFont(require('../../assets/fonts/Inter-Bold.ttf'), 32);
  const font48 = useFont(require('../../assets/fonts/Inter-Bold.ttf'), 48);
  const font64 = useFont(require('../../assets/fonts/Inter-Bold.ttf'), 64);
  
  // Track container dimensions for proper image sizing
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageLoadTimeout, setImageLoadTimeout] = useState(false);
  
  // Set timeout for image loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!skiaImage) {
        console.error('Skia image failed to load:', uri);
        setImageLoadTimeout(true);
      }
    }, 3000); // 3 second timeout
    
    return () => clearTimeout(timer);
  }, [skiaImage, uri]);
  
  // Determine if adjustments are active
  const hasAdjustments = 
    brightness !== 0 || 
    contrast !== 1 || 
    saturation !== 1 || 
    temperature !== 0 || 
    tint !== 0;
    
  const hasActiveFilter = filter && filter.id !== 'none';

  // Log filter changes
  useEffect(() => {
    if (__DEV__ && filter) {
      console.log('ImageDisplay: Filter changed to:', {
        filterName: filter.name,
        filterId: filter.id,
        brightness: filter.brightness,
        contrast: filter.contrast,
        saturation: filter.saturation,
        tintColor: filter.tintColor,
      });
    }
  }, [filter]);  // Combine filter and manual adjustments
  const colorMatrix = useMemo(() => buildColorMatrix({
    brightness,
    contrast,
    saturation,
    temperature,
    tint,
  }, filter), [brightness, contrast, saturation, temperature, tint, filter]);

  // Calculate image dimensions to fit container (not full screen)
  const imageDimensions = useMemo(() => {
    if (!skiaImage || !containerSize.width || !containerSize.height) {
      return { x: 0, y: 0, width: containerSize.width || 400, height: containerSize.height || 600 };
    }
    
    const imgWidth = skiaImage.width();
    const imgHeight = skiaImage.height();
    const imgRatio = imgWidth / imgHeight;
    const containerRatio = containerSize.width / containerSize.height;
    
    let width = containerSize.width;
    let height = containerSize.height;
    let x = 0;
    let y = 0;
    
    if (imgRatio > containerRatio) {
      // Image is wider than container - fit to width
      height = containerSize.width / imgRatio;
      y = (containerSize.height - height) / 2;
    } else {
      // Image is taller than container - fit to height
      width = containerSize.height * imgRatio;
      x = (containerSize.width - width) / 2;
    }
    
    return { x, y, width, height };
  }, [skiaImage, containerSize]);

  // Always use Skia when available for consistent filter/adjustment application
  const useSkia = skiaImage && containerSize.width > 0;

  // Debug logging (after all calculations)
  useEffect(() => {
    if (__DEV__) {
      console.log('ImageDisplay Render Debug:', {
        uri: uri?.substring(0, 50) + '...',
        skiaImageLoaded: !!skiaImage,
        skiaImageSize: skiaImage ? { width: skiaImage.width(), height: skiaImage.height() } : null,
        containerSize,
        imageDimensions,
        hasFilter: !!filter,
        filterName: filter?.name,
        useSkia,
        colorMatrixApplied: !!colorMatrix,
        tintColorPresent: !!filter?.tintColor,
      });
    }
  }, [skiaImage, containerSize, imageDimensions, filter, useSkia, colorMatrix, uri]);

  return (
    <View 
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }}
    >
      {useSkia ? (
        /* Skia Canvas for GPU-accelerated rendering with filters */
        <Canvas 
          style={styles.canvas}
        >
          <Group>
            {skiaImage && (
              <>
                <SkiaImage
                  image={skiaImage}
                  x={imageDimensions.x}
                  y={imageDimensions.y}
                  width={imageDimensions.width}
                  height={imageDimensions.height}
                  fit="contain"
                >
                  <ColorMatrix matrix={colorMatrix} />
                </SkiaImage>
                
                {/* Apply filter tintColor overlay if present */}
                {filter?.tintColor && (
                  <Rect
                    x={imageDimensions.x}
                    y={imageDimensions.y}
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                    color={filter.tintColor}
                  />
                )}
              </>
            )}
            
            {/* Render text layers on top of image */}
            {textLayers.map((layer, index) => {
              // Select appropriate font based on layer's font size
              const fontSize = layer.fontSize || 32;
              let layerFont = font32;
              
              if (fontSize <= 24) {
                layerFont = font24;
              } else if (fontSize <= 32) {
                layerFont = font32;
              } else if (fontSize <= 48) {
                layerFont = font48;
              } else {
                layerFont = font64;
              }
              
              if (!layerFont) return null;
              
              return (
                <SkiaText
                  key={index}
                  text={layer.text}
                  x={layer.x || 50}
                  y={layer.y || 100}
                  font={layerFont}
                  color={layer.color}
                  opacity={layer.opacity}
                />
              );
            })}
          </Group>
        </Canvas>
      ) : (
        /* Fallback expo-image for initial display */
        <Image
          source={{ uri }}
          style={styles.fallbackImage}
          contentFit="contain"
          transition={150}
        />
      )}
      
      {/* Visual indicator of active filters/adjustments */}
      {(showIndicators && (hasAdjustments || hasActiveFilter)) && (
        <View style={styles.indicatorContainer}>
          <View style={styles.indicator}>
            {hasActiveFilter && (
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>{filter.icon}</Text>
                <Text style={styles.badgeText}>{filter.name}</Text>
              </View>
            )}
            {hasAdjustments && (
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>⚙️</Text>
                <Text style={styles.badgeText}>Custom</Text>
              </View>
            )}
          </View>
          <View style={styles.note}>
            <Text style={styles.noteText}>
              ⓘ Live Preview · Tap Save to apply
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fallbackImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  indicatorContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
  indicator: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  note: {
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  noteText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});
