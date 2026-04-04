import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
import { Button } from './Button';
import { LoadingOverlay } from './LoadingOverlay';

interface BuySellModalProps {
  visible: boolean;
  stockSymbol: string;
  stockPrice: number;
  type: 'buy' | 'sell';
  onClose: () => void;
  onConfirm: (quantity: number) => Promise<boolean>;
}

export const BuySellModal: React.FC<BuySellModalProps> = ({
  visible,
  stockSymbol,
  stockPrice,
  type,
  onClose,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quantityNum = parseInt(quantity, 10) || 0;
  const totalCost = quantityNum * stockPrice;
  const buttonColor = type === 'buy' ? colors.success : colors.error;
  const buttonLabel = type === 'buy' ? 'Buy' : 'Sell';

  const handleConfirm = async () => {
    if (quantityNum <= 0) {
      setError('Quantity must be at least 1');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await onConfirm(quantityNum);
      if (success) {
        setQuantity('1');
        onClose();
      } else {
        setError(`${buttonLabel} failed. Please try again.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `${buttonLabel} failed`);
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity((parseInt(quantity, 10) + 1).toString());
  };

  const decrementQuantity = () => {
    const newQuantity = Math.max(1, parseInt(quantity, 10) - 1);
    setQuantity(newQuantity.toString());
  };

  const handleClose = () => {
    setQuantity('1');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <LoadingOverlay
        visible={loading}
        message={`${buttonLabel === 'Buy' ? 'Purchasing' : 'Selling'}...`}
      />

      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {type === 'buy' ? 'Buy' : 'Sell'} {stockSymbol}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Stock Price Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Current Price</Text>
            <Text style={styles.stockPrice}>₹{stockPrice.toFixed(2)}</Text>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Quantity Section */}
          <View style={styles.quantitySection}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decrementQuantity}
                disabled={loading}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>

              <RNTextInput
                style={styles.quantityInput}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
                editable={!loading}
              />

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={incrementQuantity}
                disabled={loading}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Cost */}
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{totalCost.toLocaleString('en-IN')}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={handleClose}
              disabled={loading}
            />
            <Button
              title={buttonLabel}
              onPress={handleConfirm}
              loading={loading}
              disabled={loading || quantityNum <= 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  closeButton: {
    fontSize: 24,
    color: colors.textMuted,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  stockPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
  },
  errorBanner: {
    backgroundColor: colors.errorLight,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
  },
  quantitySection: {
    marginBottom: 20,
  },
  label: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.screenBackground,
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  totalSection: {
    backgroundColor: colors.screenBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  totalLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});
