import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Filter/Palette Icon
export const FilterIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="7" cy="7" r="3" fill={color} opacity="0.7" />
    <Circle cx="17" cy="7" r="3" fill={color} opacity="0.5" />
    <Circle cx="7" cy="17" r="3" fill={color} opacity="0.8" />
    <Circle cx="17" cy="17" r="3" fill={color} opacity="0.6" />
  </Svg>
);

// Adjust/Sliders Icon
export const AdjustIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="4" y1="7" x2="20" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="9" cy="7" r="2" fill={color} />
    <Line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="15" cy="12" r="2" fill={color} />
    <Line x1="4" y1="17" x2="20" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="11" cy="17" r="2" fill={color} />
  </Svg>
);

// Crop Icon
export const CropIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 3V7M7 7H3M7 7V17C7 18.1046 7.89543 19 9 19H19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M17 21V17M17 17H21M17 17H7C5.89543 17 5 16.1046 5 15V5" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Text Icon
export const TextIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 5H20M12 5V19M8 19H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Back/Close Icon
export const BackIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Close X Icon
export const CloseIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Undo Icon
export const UndoIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 14L4 9L9 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 9H15C17.7614 9 20 11.2386 20 14C20 16.7614 17.7614 19 15 19H13" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Copy Icon
export const CopyIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Save/Check Icon
export const SaveIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Home Icon
export const HomeIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// QR Code Icon
export const QRIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
    <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
    <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
    <Rect x="16" y="16" width="3" height="3" fill={color} />
    <Rect x="14" y="14" width="3" height="3" fill={color} />
  </Svg>
);

// Camera/Scan Icon
export const ScanIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" />
  </Svg>
);

// Rotate Icon
export const RotateIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21.5 2V8H15.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 8C19.5 5.5 17 4 14 4C9 4 5 8 5 13C5 18 9 22 14 22C18 22 21.5 19 22.5 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Flip Icon
export const FlipIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3V21M12 3L8 7M12 3L16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 9V21M6 9V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
