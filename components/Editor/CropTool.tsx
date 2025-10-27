import { Image } from 'expo-image';
import { FlipType, manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image as RNImage, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackIcon, FlipIcon, RotateIcon } from '../Icons';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 60;
const CONTROLS_HEIGHT = 240;

// Professional color palette
const COLORS = {
  background: '#0A0A0A',
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  primary: '#0A84FF',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
};

interface CropToolProps {
  imageUri: string;
  onCropComplete: (croppedUri: string) => void;
  onClose: () => void;
}

const aspectRatios = [
  { name: 'Free', ratio: null, icon: '⬜' },
  { name: '1:1', ratio: 1, icon: '◻️' },
  { name: '4:5', ratio: 4 / 5, icon: '▭' },
  { name: '16:9', ratio: 16 / 9, icon: '▬' },
];

export default function CropTool({ imageUri, onCropComplete, onClose }: CropToolProps) {
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const insets = useSafeAreaInsets();

  // Get actual image dimensions
  useEffect(() => {
    // Use React Native's Image.getSize to get actual dimensions
    RNImage.getSize(
      imageUri,
      (width, height) => {
        setImageDimensions({ width, height });
        console.log('Image dimensions:', { width, height });
      },
      (error) => {
        console.error('Failed to get image size:', error);
        // Set default dimensions if loading fails
        setImageDimensions({ width: 1000, height: 1000 });
      }
    );
  }, [imageUri]);

  const handleCrop = async () => {
    if (processing) return;
    
    setProcessing(true);
    try {
      const actions: any[] = [];
      
      console.log('Processing image:', imageUri);
      
      if (rotation !== 0) {
        actions.push({ rotate: rotation });
      }
      
      if (selectedRatio && imageDimensions) {
        // Calculate crop dimensions based on actual image size and selected ratio
        let cropWidth: number;
        let cropHeight: number;
        let originX: number;
        let originY: number;

        const imageRatio = imageDimensions.width / imageDimensions.height;

        if (selectedRatio > imageRatio) {
          // Crop is wider than image - fit to width
          cropWidth = imageDimensions.width;
          cropHeight = cropWidth / selectedRatio;
          originX = 0;
          originY = (imageDimensions.height - cropHeight) / 2;
        } else {
          // Crop is taller than image - fit to height
          cropHeight = imageDimensions.height;
          cropWidth = cropHeight * selectedRatio;
          originX = (imageDimensions.width - cropWidth) / 2;
          originY = 0;
        }

        actions.push({
          crop: {
            originX: Math.round(originX),
            originY: Math.round(originY),
            width: Math.round(cropWidth),
            height: Math.round(cropHeight),
          }
        });
        
        console.log('Crop params:', { originX, originY, width: cropWidth, height: cropHeight });
      }

      if (actions.length === 0) {
        // No transformations selected
        Alert.alert('No Changes', 'Please select a crop ratio or apply a transformation.');
        setProcessing(false);
        return;
      }

      // Use high quality settings for both platforms
      const result = await manipulateAsync(
        imageUri,
        actions,
        { 
          compress: 1, // Max quality for editing
          format: SaveFormat.JPEG, // Consistent format
          base64: false // Don't need base64 for intermediate steps
        }
      );

      console.log('Crop completed:', result.uri);
      onCropComplete(result.uri);
    } catch (error) {
      console.error('Crop error:', error);
      Alert.alert('Error', 'Failed to crop image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFlip = async () => {
    if (processing) return;
    
    setProcessing(true);
    try {
      const result = await manipulateAsync(
        imageUri,
        [{ flip: FlipType.Horizontal }],
        { compress: 1, format: SaveFormat.JPEG }
      );
      onCropComplete(result.uri);
    } catch (error) {
      console.error('Flip error:', error);
      Alert.alert('Error', 'Failed to flip image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <BackIcon size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Crop & Transform</Text>
        <TouchableOpacity 
          onPress={handleCrop} 
          style={[styles.applyButton, processing && styles.applyButtonDisabled]}
          disabled={processing}
        >
          <Text style={styles.applyButtonText}>{processing ? 'Processing...' : 'Apply'}</Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      <View style={[styles.imageContainer, { height: height - (HEADER_HEIGHT + insets.top) - CONTROLS_HEIGHT }]}>
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.image, 
            { 
              transform: [{ rotate: `${rotation}deg` }],
              height: height - (HEADER_HEIGHT + insets.top) - CONTROLS_HEIGHT - 40
            }
          ]}
          contentFit="contain"
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aspect Ratio</Text>
            <View style={styles.ratioButtons}>
              {aspectRatios.map((ar) => (
                <TouchableOpacity
                  key={ar.name}
                  onPress={() => setSelectedRatio(ar.ratio)}
                  style={[
                    styles.ratioButton,
                    selectedRatio === ar.ratio && styles.ratioButtonActive,
                  ]}
                >
                  <Text style={styles.ratioIcon}>{ar.icon}</Text>
                  <Text style={[
                    styles.ratioButtonText,
                    selectedRatio === ar.ratio && styles.ratioButtonTextActive,
                  ]}>
                    {ar.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transform</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleRotate} style={styles.actionButton}>
                <RotateIcon size={24} color={COLORS.text} />
                <Text style={styles.actionButtonText}>Rotate</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFlip} style={styles.actionButton}>
                <FlipIcon size={24} color={COLORS.text} />
                <Text style={styles.actionButtonText}>Flip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
    zIndex: 1000,
    elevation: 5,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonDisabled: {
    backgroundColor: COLORS.primary + '60',
    opacity: 0.6,
  },
  applyButtonText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  image: {
    width: width - 40,
  },
  controls: {
    height: CONTROLS_HEIGHT,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  ratioButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  ratioButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ratioButtonActive: {
    backgroundColor: COLORS.primary + '30',
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  ratioIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  ratioButtonText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  ratioButtonTextActive: {
    color: COLORS.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
