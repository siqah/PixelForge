import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface TextToolProps {
  onAddText: (textData: { text: string; color: string; fontSize: number; opacity: number; x: number; y: number }) => void;
}

const colors = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#FF3B30' },
  { name: 'Green', value: '#34C759' },
  { name: 'Blue', value: '#007AFF' },
  { name: 'Yellow', value: '#FFCC00' },
  { name: 'Purple', value: '#AF52DE' },
  { name: 'Pink', value: '#FF2D55' },
];

// Professional color palette
const COLORS = {
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  primary: '#0A84FF',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
};

export default function TextTool({ onAddText }: TextToolProps) {
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(32);
  const [opacity, setOpacity] = useState(1);

  const handleAdd = () => {
    if (text.trim()) {
      // Get screen dimensions for default positioning
      const { width, height } = Dimensions.get('window');
      
      // Place text in center of screen by default
      const x = width / 2 - 100; // Offset for approximate text width
      const y = height / 2;
      
      onAddText({ text, color: selectedColor, fontSize, opacity, x, y });
      setText('');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TextInput
        placeholder="Enter your text"
        placeholderTextColor={COLORS.textSecondary}
        value={text}
        onChangeText={setText}
        style={styles.input}
        multiline
        maxLength={100}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Text Color</Text>
        <ScrollView horizontal style={styles.colorPicker} showsHorizontalScrollIndicator={false}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color.value}
              onPress={() => setSelectedColor(color.value)}
              style={[
                styles.colorButton,
                { backgroundColor: color.value },
                selectedColor === color.value && styles.colorButtonActive,
              ]}
            >
              {selectedColor === color.value && (
                <View style={styles.colorCheckmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sliderHeader}>
          <Text style={styles.label}>Font Size</Text>
          <Text style={styles.value}>{Math.round(fontSize)}pt</Text>
        </View>
        <Slider
          minimumValue={16}
          maximumValue={72}
          value={fontSize}
          onValueChange={setFontSize}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor={COLORS.surfaceLight}
          thumbTintColor={COLORS.primary}
          style={styles.slider}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sliderHeader}>
          <Text style={styles.label}>Opacity</Text>
          <Text style={styles.value}>{Math.round(opacity * 100)}%</Text>
        </View>
        <Slider
          minimumValue={0}
          maximumValue={1}
          value={opacity}
          onValueChange={setOpacity}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor={COLORS.surfaceLight}
          thumbTintColor={COLORS.primary}
          style={styles.slider}
        />
      </View>

      <TouchableOpacity 
        onPress={handleAdd} 
        disabled={!text.trim()}
        style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
      >
        <Text style={styles.addButtonText}>Add Text</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  colorPicker: {
    flexDirection: 'row',
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButtonActive: {
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  colorCheckmark: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  slider: {
    height: 40,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.surfaceLight,
  },
  addButtonText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
  },
});
