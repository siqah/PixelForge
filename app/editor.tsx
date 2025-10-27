import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CropTool from '../components/Editor/CropTool';
import ImageDisplay from '../components/Editor/ImageDisplay';
import PresetShare from '../components/Editor/PresetShare';
import TextTool from '../components/Editor/TextTool';
import FilterGrid from '../components/Filter/FilterGrid';
import { AdjustIcon, BackIcon, CopyIcon, CropIcon, FilterIcon, SaveIcon, TextIcon, UndoIcon } from '../components/Icons';
import { Filter, FILTERS } from '../constants/filters';
import { AdjustmentState } from '../utils/colorMatrix';
import { renderImageWithAdjustments } from '../utils/imageProcessing';

const { height } = Dimensions.get('window');

// Professional color palette (matching gallery)
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
  overlay: 'rgba(0, 0, 0, 0.9)',
};

// Tool icons (using emojis for simplicity)
const TOOLS = [
  { id: 'filters', label: 'Filters', IconComponent: FilterIcon },
  { id: 'adjust', label: 'Adjust', IconComponent: AdjustIcon },
  { id: 'crop', label: 'Crop', IconComponent: CropIcon },
  { id: 'text', label: 'Text', IconComponent: TextIcon },
];

export default function Editor() {
  const { imageUri } = useLocalSearchParams();
  const router = useRouter();
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<AdjustmentState>({
    brightness: 0,
    contrast: 1,
    saturation: 1,
    temperature: 0,
    tint: 0,
  });
  const [currentFilter, setCurrentFilter] = useState<Filter | null>(FILTERS[0]); // Start with "Original"
  const [userPresets, setUserPresets] = useState<any[]>([]);
  const [presetName, setPresetName] = useState('');
  const [showCropTool, setShowCropTool] = useState(false);
  const [textLayers, setTextLayers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [mediaLibraryPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  
  // Animation for tool panel
  const [panelHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    loadPresets();
  }, []);

  useEffect(() => {
    // Animate panel when tool changes
    Animated.spring(panelHeight, {
      toValue: currentTool ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
    }).start();
  }, [currentTool]);

  const loadPresets = async () => {
    try {
      const stored = await AsyncStorage.getItem('@presets');
      if (stored) {
        setUserPresets(JSON.parse(stored));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const savePreset = async () => {
    if (!presetName.trim()) {
      Alert.alert('Error', 'Enter a preset name.');
      return;
    }
    const newPreset = { name: presetName, adjustments, filter: currentFilter };
    const updated = [...userPresets, newPreset];
    setUserPresets(updated);
    await AsyncStorage.setItem('@presets', JSON.stringify(updated));
    setPresetName('');
    Alert.alert('Saved', 'Preset saved.');
  };

  const applyPreset = (preset: any) => {
    setAdjustments(preset.adjustments);
    setCurrentFilter(preset.filter || FILTERS[0]);
  };

  const addToHistory = () => {
    const newState = { adjustments, filter: currentFilter, textLayers };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setAdjustments(prevState.adjustments);
      setCurrentFilter(prevState.filter || FILTERS[0]);
      setTextLayers(prevState.textLayers);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleCopyEdits = async () => {
    const clipboard = { adjustments, filter: currentFilter };
    await AsyncStorage.setItem('@clipboard', JSON.stringify(clipboard));
    Alert.alert('Copied', 'Edits copied to clipboard');
  };

  const handleCropComplete = (croppedUri: string) => {
    // Update the image URI with the cropped version
    setShowCropTool(false);
    Alert.alert('Cropped', 'Crop applied');
  };

  const handleAddText = (textData: any) => {
    setTextLayers([...textLayers, textData]);
    setCurrentTool(null);
  };

  const handleImportPreset = async (preset: any) => {
    const updated = [...userPresets, preset];
    setUserPresets(updated);
    await AsyncStorage.setItem('@presets', JSON.stringify(updated));
  };

  const uri = Array.isArray(imageUri) ? imageUri[0] : imageUri;

  const updateAdjustment = (key: keyof AdjustmentState, value: number) => {
    setAdjustments(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectFilter = (filter: Filter) => {
    console.log('Filter selected:', filter.name, filter.id);
    setCurrentFilter(filter);
    setCurrentTool(null); // Close filter panel after selection
  };

  const ensureMediaLibraryPermission = async (): Promise<boolean> => {
    if (mediaLibraryPermission?.granted) {
      return true;
    }

    const permissionResult = requestMediaPermission
      ? await requestMediaPermission()
      : await MediaLibrary.requestPermissionsAsync();

    if (permissionResult?.granted) {
      return true;
    }

    Alert.alert(
      'Permission Required',
      'Media Library access is needed to save your edited photo. Enable the permission in system settings and try again.'
    );
    return false;
  };

  const handleSave = async () => {
    if (saving) {
      return;
    }

    const hasPermission = await ensureMediaLibraryPermission();
    if (!hasPermission) {
      return;
    }

    if (!uri) {
      Alert.alert('Error', 'No image selected to save.');
      return;
    }

    setSaving(true);
    try {
      const processedUri = await renderImageWithAdjustments({
        sourceUri: uri,
        adjustments,
        filter: currentFilter,
      });

      await MediaLibrary.createAssetAsync(processedUri);
      Alert.alert(
        'Saved!', 
        'Your edited photo has been saved to your camera roll.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save image. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getPanelHeight = panelHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 320],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.topButton}>
          <BackIcon size={26} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.topActions}>
          <TouchableOpacity 
            onPress={handleUndo} 
            disabled={historyIndex <= 0}
            style={[styles.topButton, historyIndex <= 0 && styles.topButtonDisabled]}
          >
            <UndoIcon size={22} color={historyIndex <= 0 ? COLORS.textSecondary : COLORS.text} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleCopyEdits} style={styles.topButton}>
            <CopyIcon size={22} color={COLORS.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleSave} 
            disabled={saving}
            style={styles.saveButton}
          >
            <SaveIcon size={20} color={COLORS.text} />
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Display */}
      <View style={styles.imageContainer}>
        <ImageDisplay uri={uri} {...adjustments} filter={currentFilter} textLayers={textLayers} />
      </View>

      {/* Bottom Toolbar */}
      <View style={styles.toolbar}>
        {TOOLS.map((tool) => {
          const Icon = tool.IconComponent;
          return (
            <TouchableOpacity
              key={tool.id}
              onPress={() => {
                if (tool.id === 'crop') {
                  setShowCropTool(true);
                  setCurrentTool(null);
                } else {
                  setCurrentTool(currentTool === tool.id ? null : tool.id);
                }
              }}
              style={[
                styles.toolButton,
                currentTool === tool.id && styles.toolButtonActive,
              ]}
            >
              <Icon 
                size={24} 
                color={currentTool === tool.id ? COLORS.primary : COLORS.textSecondary} 
              />
              <Text style={[
                styles.toolLabel,
                currentTool === tool.id && styles.toolLabelActive,
              ]}>
                {tool.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tool Panel */}
      <Animated.View style={[styles.toolPanel, { height: getPanelHeight }]}>
        <ScrollView 
          style={styles.toolPanelContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {currentTool === 'adjust' && (
            <View style={styles.adjustPanel}>
              <Text style={styles.panelTitle}>Adjustments</Text>
              
              {Object.entries(adjustments).map(([key, value]) => (
                <View key={key} style={styles.sliderContainer}>
                  <View style={styles.sliderHeader}>
                    <Text style={styles.sliderLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                    <Text style={styles.sliderValue}>
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </Text>
                  </View>
                  <Slider
                    minimumValue={key === 'saturation' || key === 'contrast' ? 0 : -1}
                    maximumValue={key === 'saturation' ? 2 : key === 'contrast' ? 1.5 : 1}
                    value={value as number}
                    onValueChange={(val: number) => updateAdjustment(key as keyof AdjustmentState, val)}
                    minimumTrackTintColor={COLORS.primary}
                    maximumTrackTintColor={COLORS.surfaceLight}
                    thumbTintColor={COLORS.primary}
                    style={styles.slider}
                  />
                </View>
              ))}

              <View style={styles.presetSection}>
                <Text style={styles.sectionTitle}>Save as Preset</Text>
                <TextInput
                  placeholder="Enter preset name"
                  placeholderTextColor={COLORS.textSecondary}
                  value={presetName}
                  onChangeText={setPresetName}
                  style={styles.input}
                />
                <TouchableOpacity onPress={savePreset} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Save Preset</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {currentTool === 'filters' && (
            <View style={styles.filterPanel}>
              <Text style={styles.panelTitle}>Filters & Presets</Text>
              <FilterGrid 
                imageUri={uri}
                currentFilter={currentFilter}
                onSelectFilter={handleSelectFilter} 
                userPresets={userPresets} 
                onSelectPreset={applyPreset} 
              />
              <View style={styles.shareSection}>
                <PresetShare 
                  preset={{ name: presetName || 'Current', adjustments, filter: currentFilter }} 
                  onImportPreset={handleImportPreset} 
                />
              </View>
            </View>
          )}
          
          {currentTool === 'text' && (
            <View style={styles.textPanel}>
              <Text style={styles.panelTitle}>Add Text</Text>
              <TextTool onAddText={handleAddText} />
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* Crop Modal */}
      {showCropTool && (
        <Modal visible={true} animationType="slide" presentationStyle="fullScreen" statusBarTranslucent>
          <CropTool 
            imageUri={uri} 
            onCropComplete={handleCropComplete} 
            onClose={() => setShowCropTool(false)} 
          />
        </Modal>
      )}
    </SafeAreaView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  topButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  topButtonDisabled: {
    opacity: 0.3,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 70,
  },
  toolButtonActive: {
    backgroundColor: COLORS.surfaceLight,
  },
  toolLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  toolLabelActive: {
    color: COLORS.text,
  },
  toolPanel: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    overflow: 'hidden',
  },
  toolPanelContent: {
    flex: 1,
  },
  adjustPanel: {
    padding: 20,
  },
  filterPanel: {
    padding: 20,
  },
  textPanel: {
    padding: 20,
  },
  panelTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  sliderValue: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  slider: {
    height: 40,
  },
  presetSection: {
    marginTop: 8,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  shareSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
  },
});