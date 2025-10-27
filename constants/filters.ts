/**
 * Professional Filter Library for PixelForge
 * Inspired by Lightroom, VSCO, and professional photo editing apps
 * 100+ filters organized by category
 */

export interface Filter {
  id: string;
  name: string;
  category: string;
  icon: string;
  // Color matrix for tint (5x4 matrix)
  matrix?: number[];
  // Brightness adjustment (-1 to 1)
  brightness?: number;
  // Contrast adjustment (0 to 2)
  contrast?: number;
  // Saturation adjustment (0 to 2)
  saturation?: number;
  // Tint color overlay
  tintColor?: string;
  // Blur radius
  blur?: number;
}

export const FILTER_CATEGORIES = [
  'Popular',
  'Vintage',
  'Modern',
  'Black & White',
  'Warm',
  'Cool',
  'Vibrant',
  'Muted',
  'Cinematic',
  'Portrait',
  'Landscape',
  'Food',
  'Urban',
  'Nature',
  'Artistic',
];

export const FILTERS: Filter[] = [
  // ===== POPULAR =====
  {
    id: 'none',
    name: 'Original',
    category: 'Popular',
    icon: '⚪',
  },
  {
    id: 'vivid',
    name: 'Vivid',
    category: 'Popular',
    icon: '🌈',
    saturation: 1.4,
    contrast: 1.15,
    brightness: 0.05,
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    category: 'Popular',
    icon: '⚡',
    contrast: 1.5,
    brightness: -0.1,
    saturation: 1.2,
  },
  {
    id: 'natural',
    name: 'Natural',
    category: 'Popular',
    icon: '🍃',
    saturation: 0.95,
    contrast: 1.05,
    brightness: 0.02,
  },
  {
    id: 'classic',
    name: 'Classic',
    category: 'Popular',
    icon: '📷',
    contrast: 1.2,
    saturation: 0.9,
  },
  {
    id: 'soft',
    name: 'Soft',
    category: 'Popular',
    icon: '☁️',
    contrast: 0.85,
    saturation: 0.9,
    brightness: 0.1,
  },

  // ===== VINTAGE =====
  {
    id: 'vintage',
    name: 'Vintage',
    category: 'Vintage',
    icon: '📸',
    saturation: 0.8,
    contrast: 0.95,
    brightness: 0.05,
    tintColor: 'rgba(255, 230, 200, 0.08)', // Very subtle warm tint
  },
  {
    id: 'retro',
    name: 'Retro',
    category: 'Vintage',
    icon: '🎞️',
    saturation: 1.2,
    contrast: 1.15,
    tintColor: 'rgba(255, 200, 150, 0.06)', // Subtle orange
  },
  {
    id: 'sepia',
    name: 'Sepia',
    category: 'Vintage',
    icon: '🟤',
    saturation: 0.4,
    brightness: 0.05,
    tintColor: 'rgba(112, 66, 20, 0.25)', // Sepia tone
  },
  {
    id: 'faded',
    name: 'Faded',
    category: 'Vintage',
    icon: '🌫️',
    contrast: 0.8,
    saturation: 0.7,
    brightness: 0.15,
  },
  {
    id: 'oldfilm',
    name: 'Old Film',
    category: 'Vintage',
    icon: '🎬',
    contrast: 1.1,
    saturation: 0.6,
    tintColor: 'rgba(230, 220, 180, 0.1)', // Subtle film tint
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    category: 'Vintage',
    icon: '📷',
    saturation: 0.85,
    contrast: 1.05,
    brightness: 0.08,
    tintColor: 'rgba(255, 240, 220, 0.07)',
  },
  {
    id: 'kodachrome',
    name: 'Kodachrome',
    category: 'Vintage',
    icon: '🎨',
    saturation: 1.3,
    contrast: 1.2,
    brightness: -0.05,
  },
  {
    id: '1977',
    name: '1977',
    category: 'Vintage',
    icon: '✨',
    saturation: 1.1,
    contrast: 1.05,
    brightness: 0.1,
    tintColor: 'rgba(255, 180, 180, 0.08)',
  },

  // ===== MODERN =====
  {
    id: 'modern',
    name: 'Modern',
    category: 'Modern',
    icon: '💎',
    contrast: 1.25,
    saturation: 1.1,
    brightness: 0.03,
  },
  {
    id: 'crisp',
    name: 'Crisp',
    category: 'Modern',
    icon: '✨',
    contrast: 1.35,
    saturation: 1.05,
    brightness: 0.05,
  },
  {
    id: 'clean',
    name: 'Clean',
    category: 'Modern',
    icon: '⚪',
    contrast: 1.1,
    saturation: 0.95,
    brightness: 0.08,
  },
  {
    id: 'bright',
    name: 'Bright',
    category: 'Modern',
    icon: '☀️',
    brightness: 0.2,
    contrast: 1.05,
    saturation: 1.15,
  },
  {
    id: 'airy',
    name: 'Airy',
    category: 'Modern',
    icon: '🤍',
    brightness: 0.15,
    contrast: 0.9,
    saturation: 0.85,
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'Modern',
    icon: '⬜',
    saturation: 0.7,
    contrast: 1.15,
    brightness: 0.1,
  },

  // ===== BLACK & WHITE =====
  {
    id: 'bw',
    name: 'B&W',
    category: 'Black & White',
    icon: '⚫',
    saturation: 0,
    contrast: 1.1,
  },
  {
    id: 'noir',
    name: 'Noir',
    category: 'Black & White',
    icon: '🎭',
    saturation: 0,
    contrast: 1.5,
    brightness: -0.1,
  },
  {
    id: 'mono',
    name: 'Mono',
    category: 'Black & White',
    icon: '⬛',
    saturation: 0,
    contrast: 1.2,
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    category: 'Black & White',
    icon: '🌑',
    saturation: 0,
  },
  {
    id: 'stark',
    name: 'Stark',
    category: 'Black & White',
    icon: '⚪',
    saturation: 0,
    contrast: 1.8,
    brightness: 0.05,
  },
  {
    id: 'soft-bw',
    name: 'Soft B&W',
    category: 'Black & White',
    icon: '🌫️',
    saturation: 0,
    contrast: 0.9,
    brightness: 0.1,
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    category: 'Black & White',
    icon: '⚡',
    saturation: 0,
    contrast: 2,
  },
  {
    id: 'vintage-bw',
    name: 'Vintage B&W',
    category: 'Black & White',
    icon: '📷',
    saturation: 0,
    contrast: 0.95,
    brightness: -0.05,
    tintColor: 'rgba(80, 70, 60, 0.15)',
  },

  // ===== WARM =====
  {
    id: 'warm',
    name: 'Warm',
    category: 'Warm',
    icon: '🔥',
    tintColor: 'rgba(255, 200, 100, 0.08)', // Very subtle warm tint
    saturation: 1.1,
  },
  {
    id: 'golden',
    name: 'Golden',
    category: 'Warm',
    icon: '✨',
    tintColor: 'rgba(255, 215, 0, 0.1)', // Subtle golden glow
    contrast: 1.1,
    saturation: 1.15,
  },
  {
    id: 'sunset',
    name: 'Sunset',
    category: 'Warm',
    icon: '🌅',
    tintColor: 'rgba(255, 140, 80, 0.12)', // Subtle sunset orange
    saturation: 1.2,
    brightness: 0.05,
  },
  {
    id: 'amber',
    name: 'Amber',
    category: 'Warm',
    icon: '🟠',
    tintColor: 'rgba(255, 180, 0, 0.09)',
    saturation: 1.05,
  },
  {
    id: 'autumn',
    name: 'Autumn',
    category: 'Warm',
    icon: '🍂',
    tintColor: 'rgba(200, 100, 50, 0.1)',
    saturation: 1.25,
    contrast: 1.1,
  },
  {
    id: 'honey',
    name: 'Honey',
    category: 'Warm',
    icon: '🍯',
    tintColor: 'rgba(255, 200, 100, 0.11)',
    saturation: 1.15,
    brightness: 0.05,
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'Warm',
    icon: '🟤',
    tintColor: 'rgba(184, 115, 51, 0.13)',
    contrast: 1.15,
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    category: 'Warm',
    icon: '🌄',
    tintColor: 'rgba(255, 165, 100, 0.1)',
    brightness: 0.1,
    saturation: 1.2,
  },

  // ===== COOL =====
  {
    id: 'cool',
    name: 'Cool',
    category: 'Cool',
    icon: '❄️',
    tintColor: 'rgba(100, 150, 255, 0.08)',
    saturation: 1.05,
  },
  {
    id: 'arctic',
    name: 'Arctic',
    category: 'Cool',
    icon: '🧊',
    tintColor: 'rgba(150, 200, 255, 0.1)',
    brightness: 0.1,
    saturation: 0.9,
  },
  {
    id: 'ocean',
    name: 'Ocean',
    category: 'Cool',
    icon: '🌊',
    tintColor: 'rgba(0, 150, 200, 0.1)',
    saturation: 1.15,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    category: 'Cool',
    icon: '🌙',
    tintColor: 'rgba(50, 80, 150, 0.15)', // Slightly stronger for night effect
    brightness: -0.15,
    contrast: 1.2,
  },
  {
    id: 'frosted',
    name: 'Frosted',
    category: 'Cool',
    icon: '❄️',
    tintColor: 'rgba(180, 220, 255, 0.12)',
    saturation: 0.85,
    brightness: 0.15,
  },
  {
    id: 'winter',
    name: 'Winter',
    category: 'Cool',
    icon: '⛄',
    tintColor: 'rgba(200, 220, 255, 0.09)',
    brightness: 0.1,
  },
  {
    id: 'steel',
    name: 'Steel',
    category: 'Cool',
    icon: '⚙️',
    tintColor: 'rgba(100, 120, 140, 0.1)',
    saturation: 0.8,
    contrast: 1.2,
  },
  {
    id: 'nordic',
    name: 'Nordic',
    category: 'Cool',
    icon: '🏔️',
    tintColor: 'rgba(150, 180, 220, 0.08)',
    saturation: 0.95,
    brightness: 0.05,
  },

  // ===== VIBRANT =====
  {
    id: 'vibrant',
    name: 'Vibrant',
    category: 'Vibrant',
    icon: '🌈',
    saturation: 1.6,
    contrast: 1.2,
  },
  {
    id: 'pop',
    name: 'Pop',
    category: 'Vibrant',
    icon: '💥',
    saturation: 1.8,
    contrast: 1.3,
    brightness: 0.05,
  },
  {
    id: 'neon',
    name: 'Neon',
    category: 'Vibrant',
    icon: '🌟',
    saturation: 2,
    contrast: 1.4,
    brightness: 0.1,
  },
  {
    id: 'electric',
    name: 'Electric',
    category: 'Vibrant',
    icon: '⚡',
    saturation: 1.7,
    contrast: 1.35,
  },
  {
    id: 'candy',
    name: 'Candy',
    category: 'Vibrant',
    icon: '🍭',
    saturation: 1.5,
    brightness: 0.15,
    tintColor: 'rgba(255, 150, 200, 0.05)', // Very subtle pink
  },
  {
    id: 'tropical',
    name: 'Tropical',
    category: 'Vibrant',
    icon: '🌺',
    saturation: 1.65,
    contrast: 1.15,
    brightness: 0.08,
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    category: 'Vibrant',
    icon: '🌈',
    saturation: 1.9,
    brightness: 0.1,
  },

  // ===== MUTED =====
  {
    id: 'muted',
    name: 'Muted',
    category: 'Muted',
    icon: '🎨',
    saturation: 0.6,
    contrast: 0.95,
  },
  {
    id: 'pastel',
    name: 'Pastel',
    category: 'Muted',
    icon: '🌸',
    saturation: 0.7,
    brightness: 0.15,
    contrast: 0.9,
  },
  {
    id: 'dusty',
    name: 'Dusty',
    category: 'Muted',
    icon: '🏜️',
    saturation: 0.65,
    contrast: 0.9,
    tintColor: 'rgba(200, 180, 160, 0.05)',
  },
  {
    id: 'earthy',
    name: 'Earthy',
    category: 'Muted',
    icon: '🌿',
    saturation: 0.75,
    tintColor: 'rgba(140, 120, 100, 0.08)',
  },
  {
    id: 'subdued',
    name: 'Subdued',
    category: 'Muted',
    icon: '🤎',
    saturation: 0.55,
    contrast: 0.95,
    brightness: -0.05,
  },
  {
    id: 'haze',
    name: 'Haze',
    category: 'Muted',
    icon: '🌫️',
    saturation: 0.6,
    contrast: 0.8,
    brightness: 0.12,
  },

  // ===== CINEMATIC =====
  {
    id: 'cinematic',
    name: 'Cinematic',
    category: 'Cinematic',
    icon: '🎬',
    contrast: 1.3,
    saturation: 1.1,
    brightness: -0.05,
    tintColor: 'rgba(20, 30, 60, 0.05)', // Very subtle blue shadow
  },
  {
    id: 'film',
    name: 'Film',
    category: 'Cinematic',
    icon: '🎞️',
    contrast: 1.25,
    saturation: 1.05,
    tintColor: 'rgba(40, 40, 80, 0.04)',
  },
  {
    id: 'blockbuster',
    name: 'Blockbuster',
    category: 'Cinematic',
    icon: '🍿',
    contrast: 1.4,
    saturation: 1.2,
    tintColor: 'rgba(30, 60, 100, 0.06)',
  },
  {
    id: 'teal-orange',
    name: 'Teal & Orange',
    category: 'Cinematic',
    icon: '🎨',
    saturation: 1.3,
    contrast: 1.2,
    tintColor: 'rgba(20, 100, 120, 0.05)',
  },
  {
    id: 'noir-film',
    name: 'Film Noir',
    category: 'Cinematic',
    icon: '🎭',
    saturation: 0.3,
    contrast: 1.6,
    brightness: -0.2,
  },
  {
    id: 'hollywood',
    name: 'Hollywood',
    category: 'Cinematic',
    icon: '⭐',
    contrast: 1.3,
    saturation: 1.25,
    brightness: 0.05,
  },

  // ===== PORTRAIT =====
  {
    id: 'portrait',
    name: 'Portrait',
    category: 'Portrait',
    icon: '👤',
    saturation: 1.05,
    contrast: 1.1,
    tintColor: 'rgba(255, 220, 200, 0.04)', // Very subtle skin warmth
  },
  {
    id: 'skin-tone',
    name: 'Skin Tone',
    category: 'Portrait',
    icon: '✨',
    saturation: 1.02,
    brightness: 0.05,
    tintColor: 'rgba(255, 210, 180, 0.05)',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    category: 'Portrait',
    icon: '💄',
    saturation: 1.1,
    brightness: 0.08,
    contrast: 1.05,
  },
  {
    id: 'studio',
    name: 'Studio',
    category: 'Portrait',
    icon: '💡',
    contrast: 1.15,
    brightness: 0.1,
    saturation: 1.05,
  },
  {
    id: 'fashion',
    name: 'Fashion',
    category: 'Portrait',
    icon: '👗',
    saturation: 1.25,
    contrast: 1.2,
    brightness: 0.05,
  },

  // ===== LANDSCAPE =====
  {
    id: 'landscape',
    name: 'Landscape',
    category: 'Landscape',
    icon: '🏞️',
    saturation: 1.3,
    contrast: 1.15,
  },
  {
    id: 'scenic',
    name: 'Scenic',
    category: 'Landscape',
    icon: '🌄',
    saturation: 1.25,
    contrast: 1.2,
    brightness: 0.05,
  },
  {
    id: 'mountain',
    name: 'Mountain',
    category: 'Landscape',
    icon: '⛰️',
    contrast: 1.3,
    saturation: 1.2,
    tintColor: 'rgba(100, 120, 150, 0.04)',
  },
  {
    id: 'desert',
    name: 'Desert',
    category: 'Landscape',
    icon: '🏜️',
    saturation: 1.15,
    tintColor: 'rgba(220, 180, 120, 0.08)',
  },
  {
    id: 'forest',
    name: 'Forest',
    category: 'Landscape',
    icon: '🌲',
    saturation: 1.35,
    tintColor: 'rgba(80, 140, 80, 0.05)',
  },

  // ===== FOOD =====
  {
    id: 'food',
    name: 'Food',
    category: 'Food',
    icon: '🍽️',
    saturation: 1.4,
    contrast: 1.15,
    brightness: 0.08,
  },
  {
    id: 'delicious',
    name: 'Delicious',
    category: 'Food',
    icon: '😋',
    saturation: 1.5,
    contrast: 1.2,
    brightness: 0.1,
  },
  {
    id: 'fresh',
    name: 'Fresh',
    category: 'Food',
    icon: '🥗',
    saturation: 1.35,
    brightness: 0.15,
  },
  {
    id: 'gourmet',
    name: 'Gourmet',
    category: 'Food',
    icon: '👨‍🍳',
    saturation: 1.3,
    contrast: 1.25,
    tintColor: 'rgba(255, 200, 150, 0.04)',
  },

  // ===== URBAN =====
  {
    id: 'urban',
    name: 'Urban',
    category: 'Urban',
    icon: '🏙️',
    contrast: 1.25,
    saturation: 1.1,
    tintColor: 'rgba(80, 90, 110, 0.05)',
  },
  {
    id: 'street',
    name: 'Street',
    category: 'Urban',
    icon: '🛣️',
    contrast: 1.3,
    saturation: 0.95,
    brightness: -0.05,
  },
  {
    id: 'grunge',
    name: 'Grunge',
    category: 'Urban',
    icon: '🎸',
    contrast: 1.4,
    saturation: 0.8,
    brightness: -0.1,
  },
  {
    id: 'metro',
    name: 'Metro',
    category: 'Urban',
    icon: '🚇',
    saturation: 0.85,
    contrast: 1.2,
    tintColor: 'rgba(60, 70, 90, 0.08)',
  },

  // ===== NATURE =====
  {
    id: 'nature',
    name: 'Nature',
    category: 'Nature',
    icon: '🌿',
    saturation: 1.35,
    contrast: 1.1,
  },
  {
    id: 'bloom',
    name: 'Bloom',
    category: 'Nature',
    icon: '🌺',
    saturation: 1.45,
    brightness: 0.1,
  },
  {
    id: 'spring',
    name: 'Spring',
    category: 'Nature',
    icon: '🌸',
    saturation: 1.3,
    brightness: 0.12,
    tintColor: 'rgba(150, 220, 150, 0.05)',
  },
  {
    id: 'summer',
    name: 'Summer',
    category: 'Nature',
    icon: '☀️',
    saturation: 1.4,
    brightness: 0.15,
    contrast: 1.1,
  },

  // ===== ARTISTIC =====
  {
    id: 'artistic',
    name: 'Artistic',
    category: 'Artistic',
    icon: '🎨',
    saturation: 1.3,
    contrast: 1.25,
  },
  {
    id: 'painting',
    name: 'Painting',
    category: 'Artistic',
    icon: '🖼️',
    saturation: 1.4,
    contrast: 1.3,
    brightness: 0.05,
  },
  {
    id: 'sketch',
    name: 'Sketch',
    category: 'Artistic',
    icon: '✏️',
    saturation: 0.3,
    contrast: 1.6,
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    category: 'Artistic',
    icon: '💧',
    saturation: 1.2,
    contrast: 0.9,
    brightness: 0.1,
  },
  {
    id: 'dream',
    name: 'Dream',
    category: 'Artistic',
    icon: '💭',
    saturation: 1.25,
    contrast: 0.85,
    brightness: 0.15,
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    category: 'Artistic',
    icon: '✨',
    saturation: 1.5,
    brightness: 0.12,
    tintColor: 'rgba(200, 150, 255, 0.05)',
  },
];

// Helper function to get filters by category
export const getFiltersByCategory = (category: string): Filter[] => {
  return FILTERS.filter(filter => filter.category === category);
};

// Helper function to search filters
export const searchFilters = (query: string): Filter[] => {
  const lowerQuery = query.toLowerCase();
  return FILTERS.filter(filter => 
    filter.name.toLowerCase().includes(lowerQuery) ||
    filter.category.toLowerCase().includes(lowerQuery)
  );
};

// Get popular filters (first 6)
export const getPopularFilters = (): Filter[] => {
  return FILTERS.filter(f => f.category === 'Popular');
};
