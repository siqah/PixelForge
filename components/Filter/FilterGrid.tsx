import { Canvas, ColorMatrix, Image as SkiaImage, useImage } from '@shopify/react-native-skia';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Filter, FILTER_CATEGORIES, getFiltersByCategory } from '../../constants/filters';
import { buildColorMatrix } from '../../utils/colorMatrix';

const THUMBNAIL_SIZE = 80;

// Professional color palette
const COLORS = {
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  primary: '#0A84FF',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
};

interface FilterGridProps {
  imageUri: string;
  currentFilter: Filter | null;
  onSelectFilter: (filter: Filter) => void;
  userPresets?: any[];
  onSelectPreset?: (preset: any) => void;
}

// Filter thumbnail component with Skia
function FilterThumbnail({ imageUri, filter }: { imageUri: string; filter: Filter }) {
  const skiaImage = useImage(imageUri);
  
  const colorMatrix = useMemo(() => buildColorMatrix({
    brightness: 0,
    contrast: 1,
    saturation: 1,
    temperature: 0,
    tint: 0,
  }, filter), [filter]);

  const imageDimensions = useMemo(() => {
    if (!skiaImage) return { x: 0, y: 0, width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE };
    
    const imgWidth = skiaImage.width();
    const imgHeight = skiaImage.height();
    const ratio = imgWidth / imgHeight;
    
    let width = THUMBNAIL_SIZE;
    let height = THUMBNAIL_SIZE;
    let x = 0;
    let y = 0;
    
    if (ratio > 1) {
      height = THUMBNAIL_SIZE / ratio;
      y = (THUMBNAIL_SIZE - height) / 2;
    } else {
      width = THUMBNAIL_SIZE * ratio;
      x = (THUMBNAIL_SIZE - width) / 2;
    }
    
    return { x, y, width, height };
  }, [skiaImage]);

  return (
    <Canvas style={styles.thumbnailCanvas}>
      {skiaImage && (
        <SkiaImage
          image={skiaImage}
          x={imageDimensions.x}
          y={imageDimensions.y}
          width={imageDimensions.width}
          height={imageDimensions.height}
          fit="cover"
        >
          <ColorMatrix matrix={colorMatrix} />
        </SkiaImage>
      )}
    </Canvas>
  );
}

export default function FilterGrid({ 
  imageUri, 
  currentFilter, 
  onSelectFilter, 
  userPresets = [], 
  onSelectPreset 
}: FilterGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const categoryFilters = getFiltersByCategory(selectedCategory);

  return (
    <View>
      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        style={styles.categoryScrollView} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {FILTER_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.categoryTabActive,
            ]}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive,
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filter Grid */}
      <ScrollView 
        horizontal 
        style={styles.scrollView} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {categoryFilters.map((filter) => {
          const isSelected = currentFilter?.id === filter.id;
          
          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => onSelectFilter(filter)}
              style={styles.filterCard}
            >
              <View style={[
                styles.filterThumbnail,
                isSelected && styles.filterThumbnailSelected,
              ]}>
                {/* GPU-accelerated live preview thumbnail */}
                <FilterThumbnail imageUri={imageUri} filter={filter} />
                
                {/* Icon in corner */}
                <View style={styles.iconBadge}>
                  <Text style={styles.filterIcon}>{filter.icon}</Text>
                </View>
                {/* Selected indicator */}
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedCheck}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={[
                styles.filterName,
                isSelected && styles.filterNameSelected,
              ]} numberOfLines={1}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* User Presets */}
      {userPresets.length > 0 && (
        <View style={styles.presetsSection}>
          <Text style={styles.sectionTitle}>Your Presets</Text>
          <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
            {userPresets.map((preset, index) => (
              <TouchableOpacity
                key={`preset-${index}`}
                onPress={() => onSelectPreset && onSelectPreset(preset)}
                style={[styles.filterCard, styles.presetCard]}
              >
                <View style={[styles.filterThumbnail, styles.presetThumbnail]}>
                  <Text style={styles.presetEmoji}>⭐</Text>
                </View>
                <Text style={styles.filterName} numberOfLines={1}>
                  {preset.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryScrollView: {
    marginBottom: 16,
  },
  categoryContainer: {
    paddingRight: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: COLORS.text,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  scrollView: {
    marginBottom: 16,
  },
  filterContainer: {
    paddingRight: 16,
  },
  filterCard: {
    marginRight: 12,
    alignItems: 'center',
    width: 80,
  },
  presetCard: {
    width: 90,
  },
  filterThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
  },
  filterThumbnailSelected: {
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  thumbnailCanvas: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
  },
  iconBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 14,
  },
  selectedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheck: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  presetThumbnail: {
    backgroundColor: COLORS.primary + '30',
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterEmoji: {
    fontSize: 32,
  },
  presetEmoji: {
    fontSize: 28,
  },
  filterName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  filterNameSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  presetsSection: {
    marginTop: 8,
  },
});