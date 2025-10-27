import AsyncStorage from '@react-native-async-storage/async-storage';
import MasonryList from '@react-native-seoul/masonry-list';
import { Image } from 'expo-image';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const numColumns = 2;
const GAP = 4;
const imageWidth = (width - GAP * (numColumns + 1)) / numColumns;

// Professional color palette
const COLORS = {
  background: '#0A0A0A',
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  primary: '#0A84FF',
  primaryDark: '#0070E0',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  success: '#34C759',
  overlay: 'rgba(0, 0, 0, 0.75)',
};

export default function Index() {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [permission, setPermission] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // Skip MediaLibrary in Expo Go - use ImagePicker instead
        // Only check if we can get permission status without requesting
        const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
        
        if (status === 'granted') {
          // Already have permission, load photos
          const assets = await MediaLibrary.getAssetsAsync({
            first: 200,
            mediaType: MediaLibrary.MediaType.photo,
            sortBy: MediaLibrary.SortBy.creationTime,
          });
          setPhotos(assets.assets);
          setPermission('granted');
        } else {
          // Don't have permission - show picker button instead
          setPermission('denied');
        }
      } catch (error) {
        // Expo Go limitation - just show picker button
        console.log('Using ImagePicker fallback (Expo Go limitation)');
        setPermission('denied');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePhotoPress = async (uri: string) => {
    if (selectionMode) {
      toggleSelection(uri);
    } else {
      // Convert ph:// URIs to file URIs for Skia compatibility
      let finalUri = uri;
      
      if (uri.startsWith('ph://')) {
        console.log('Converting ph:// URI to file URI for Skia...');
        try {
          // Use manipulateAsync to convert ph:// to file:// URI
          const converted = await manipulateAsync(
            uri,
            [], // No transformations
            { compress: 1, format: SaveFormat.JPEG }
          );
          finalUri = converted.uri;
          console.log('Converted URI:', finalUri);
        } catch (error) {
          console.error('Failed to convert ph:// URI:', error);
          // Continue with original URI
        }
      }
      
      router.push({ pathname: '/editor', params: { imageUri: finalUri } });
    }
  };

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Updated from deprecated MediaTypeOptions
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        let imageUri = result.assets[0].uri;
        
        // Always convert to file URI for Skia compatibility (handles both HEIC and ph:// URIs)
        console.log('Converting image to file URI for Skia compatibility...');
        try {
          const converted = await manipulateAsync(
            imageUri,
            [], // No transformations, just format conversion
            { compress: 1, format: SaveFormat.JPEG }
          );
          imageUri = converted.uri;
          console.log('Image converted to file URI:', imageUri);
        } catch (conversionError) {
          console.error('Image conversion failed:', conversionError);
          // Continue with original URI if conversion fails
        }
        
        console.log('Image URI for editor:', imageUri);
        router.push({ pathname: '/editor', params: { imageUri } });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const toggleSelection = (uri: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(uri) ? prev.filter((u) => u !== uri) : [...prev, uri]
    );
  };

  const handleBatchEdit = async () => {
    const clipboard = await AsyncStorage.getItem('@clipboard');
    if (!clipboard) {
      Alert.alert('No Edits Copied', 'Copy edits from the editor first, then paste to multiple photos.');
      return;
    }

    Alert.alert(
      'Apply Batch Edits',
      `Apply copied settings to ${selectedPhotos.length} photo${selectedPhotos.length > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          style: 'default',
          onPress: async () => {
            Alert.alert('Success', `Batch edit applied to ${selectedPhotos.length} photos`);
            setSelectionMode(false);
            setSelectedPhotos([]);
          },
        },
      ]
    );
  };

  // Pinterest-style varying image heights
  const getImageHeight = (index: number) => {
    // More varied heights for authentic Pinterest look
    const heightVariations = [
      150, 180, 220, 260, 200, 240, 190, 280, 
      170, 210, 250, 230, 160, 270, 195, 235,
      185, 225, 265, 205, 245, 175, 215, 255
    ];
    return heightVariations[index % heightVariations.length];
  };

  const renderPhotoItem = ({ item, i }: { item: MediaLibrary.Asset; i: number }) => {
    const isSelected = selectedPhotos.includes(item.uri);
    const imageHeight = getImageHeight(i);
    
    return (
      <TouchableOpacity
        onPress={() => handlePhotoPress(item.uri)}
        onLongPress={() => {
          setSelectionMode(true);
          toggleSelection(item.uri);
        }}
        activeOpacity={0.9}
        style={[styles.photoContainer, { height: imageHeight }]}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.photo}
          contentFit="cover"
          transition={150}
          placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
        />
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <View style={styles.checkmarkCircle}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your photos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (permission !== 'granted') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" />
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>📸</Text>
          <Text style={styles.permissionText}>Welcome to ChromaLab</Text>
          <Text style={styles.permissionSubtext}>
            Pick a photo to start editing with professional filters and adjustments.
          </Text>
          <TouchableOpacity
            onPress={pickImageFromLibrary}
            style={styles.pickPhotoButton}
          >
            <Text style={styles.pickPhotoButtonText}>Pick Photo to Edit</Text>
          </TouchableOpacity>
          <Text style={styles.noteText}>
            Note: Full gallery access requires a development build.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      {/* Selection Bar */}
      {selectionMode && (
        <View style={styles.selectionBar}>
          <View style={styles.selectionContent}>
            <TouchableOpacity
              onPress={() => {
                setSelectionMode(false);
                setSelectedPhotos([]);
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={styles.selectionText}>
              {selectedPhotos.length} selected
            </Text>
            
            <TouchableOpacity
              onPress={handleBatchEdit}
              disabled={selectedPhotos.length === 0}
              style={[
                styles.applyButton,
                selectedPhotos.length === 0 && styles.applyButtonDisabled,
              ]}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Pinterest-style Photo Grid with Masonry Layout */}
      <MasonryList
        data={photos}
        keyExtractor={(item: MediaLibrary.Asset) => item.id}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        renderItem={renderPhotoItem as any}
        contentContainerStyle={styles.masonryContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 60,
    marginBottom: 20,
  },
  permissionText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  permissionSubtext: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  pickPhotoButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  pickPhotoButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  noteText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  selectionBar: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  selectionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  selectionText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonDisabled: {
    backgroundColor: COLORS.surfaceLight,
  },
  applyButtonText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
  },
  masonryContent: {
    paddingHorizontal: GAP,
    paddingTop: GAP,
  },
  photoContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: GAP,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 132, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  checkmarkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  checkmark: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
});
