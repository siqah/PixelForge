import { Camera, CameraView } from 'expo-camera';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView as SafeArea } from 'react-native-safe-area-context';
import { CloseIcon, QRIcon, ScanIcon } from '../Icons';

// Professional color palette
const COLORS = {
  background: '#0A0A0A',
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  primary: '#0A84FF',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  overlay: 'rgba(0, 0, 0, 0.9)',
};

interface PresetShareProps {
  preset: any;
  onImportPreset: (preset: any) => void;
}

export default function PresetShare({ preset, onImportPreset }: PresetShareProps) {
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const handleShowQR = () => {
    setShowQR(true);
  };

  const handleScan = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setShowScanner(true);
    } else {
      Alert.alert('Permission Denied', 'Camera access is needed to scan QR codes.');
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const importedPreset = JSON.parse(data);
      if (importedPreset.name && importedPreset.adjustments) {
        onImportPreset(importedPreset);
        setShowScanner(false);
        Alert.alert('Success', `Imported preset: "${importedPreset.name}"`);
      } else {
        Alert.alert('Invalid Code', 'This QR code does not contain a valid preset.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to read QR code. Please try again.');
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Share & Import</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleShowQR} style={styles.button}>
          <QRIcon size={24} color={COLORS.text} />
          <Text style={styles.buttonText}>Share QR</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleScan} style={styles.button}>
          <ScanIcon size={24} color={COLORS.text} />
          <Text style={styles.buttonText}>Scan QR</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code Modal */}
      <Modal visible={showQR} transparent animationType="fade">
        <SafeArea style={styles.modalOverlay} edges={['top', 'bottom']}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share Preset</Text>
            <Text style={styles.modalSubtitle}>{preset?.name || 'Current Settings'}</Text>
            
            <View style={styles.qrContainer}>
              <QRCode
                value={JSON.stringify(preset)}
                size={220}
                backgroundColor="white"
                color={COLORS.background}
              />
            </View>
            
            <Text style={styles.qrInstructions}>
              Others can scan this code to import your preset
            </Text>
            
            <TouchableOpacity onPress={() => setShowQR(false)} style={styles.closeModalButton}>
              <CloseIcon size={24} color={COLORS.text} />
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeArea>
      </Modal>

      {/* Scanner Modal */}
      <Modal visible={showScanner} animationType="slide" presentationStyle="fullScreen">
        <SafeArea style={styles.scannerContainer} edges={['top', 'bottom']}>
          <View style={styles.scannerHeader}>
            <Text style={styles.scannerTitle}>Scan Preset QR Code</Text>
            <TouchableOpacity 
              onPress={() => setShowScanner(false)} 
              style={styles.closeButton}
            >
              <CloseIcon size={28} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          {hasPermission && (
            <CameraView
              style={styles.camera}
              onBarcodeScanned={handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
            />
          )}
          
          <View style={styles.scannerFooter}>
            <Text style={styles.scannerInstructions}>
              Position the QR code within the frame
            </Text>
          </View>
        </SafeArea>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 24,
    fontWeight: '500',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
  },
  qrInstructions: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 120,
  },
  primaryButtonText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scannerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 10,
    minWidth: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  closeModalButtonText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  scannerFooter: {
    padding: 24,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  scannerInstructions: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
