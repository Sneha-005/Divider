import React from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { colors } from '../../shared/theme/colors';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.container}>
        <View style={styles.overlay}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlay: {
    backgroundColor: colors.surface,
    paddingVertical: 32,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
  },
  message: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
});
