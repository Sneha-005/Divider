import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '../../shared/theme/colors';

interface TradeModalProps {
  visible: boolean;
  symbol: string;
  currentPrice: number;
  type: 'BUY' | 'SELL';
  loading: boolean;
  onClose: () => void;
  onTrade: (quantity: number, price: number) => Promise<void>;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  visible,
  symbol,
  currentPrice,
  type,
  loading,
  onClose,
  onTrade,
}) => {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(currentPrice.toString());
  const [error, setError] = useState<string | null>(null);

  const isBuy = type === 'BUY';
  const totalAmount = (parseFloat(quantity) || 0) * (parseFloat(price) || 0);
  const fee = totalAmount * 0.005; // 0.5% fee
  const finalAmount = totalAmount + fee;

  const handleTrade = async () => {
    if (!quantity || !price) {
      setError('Please fill in all fields');
      return;
    }

    const qty = parseFloat(quantity);
    const priceVal = parseFloat(price);

    if (qty <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (priceVal <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      setError(null);
      await onTrade(qty, priceVal);
      setQuantity('');
      setPrice(currentPrice.toString());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Trade failed');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <View style={styles.bottomSheet}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.title}>{isBuy ? 'Buy' : 'Sell'} Stock</Text>
              <View style={{ width: 30 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Symbol Display */}
              <View style={styles.symbolSection}>
                <Text style={styles.symbolLabel}>Symbol</Text>
                <Text style={styles.symbolValue}>{symbol}</Text>
              </View>

              {/* Current Price */}
              <View style={styles.section}>
                <Text style={styles.label}>Current Market Price</Text>
                <View style={styles.priceDisplay}>
                  <Text style={styles.priceText}>₹{currentPrice.toFixed(2)}</Text>
                </View>
              </View>

              {/* Quantity Input */}
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Quantity</Text>
                  <Text style={styles.labelHint}>shares</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter quantity"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={quantity}
                  onChangeText={setQuantity}
                  editable={!loading}
                />
              </View>

              {/* Price Input */}
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Price Per Share</Text>
                  <Text style={styles.labelHint}>₹</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter price"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                  editable={!loading}
                />
              </View>

              {/* Calculation Summary */}
              <View style={styles.summarySection}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>
                    ₹{totalAmount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Fee (0.5%)</Text>
                  <Text style={styles.summaryValue}>₹{fee.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowBold]}>
                  <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>
                    Total {isBuy ? 'Debit' : 'Credit'}
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      styles.summaryValueBold,
                      {
                        color: isBuy ? '#EF4444' : '#34D399',
                      },
                    ]}
                  >
                    {isBuy ? '-' : '+'}₹{finalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Error Message */}
              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  isBuy ? styles.buyButton : styles.sellButton,
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleTrade}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isBuy ? 'Buy' : 'Sell'} Now
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#1A1F3A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3556',
  },
  closeButton: {
    fontSize: 24,
    color: '#B0B8D4',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  symbolSection: {
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  symbolLabel: {
    fontSize: 12,
    color: '#B0B8D4',
    fontWeight: '500',
    marginBottom: 8,
  },
  symbolValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  labelHint: {
    fontSize: 12,
    color: '#B0B8D4',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0A0E27',
    borderWidth: 1,
    borderColor: '#2D3556',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  priceDisplay: {
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2D3556',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34D399',
  },
  summarySection: {
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryRowBold: {
    marginBottom: 0,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2D3556',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#B0B8D4',
    fontWeight: '500',
  },
  summaryLabelBold: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  summaryValueBold: {
    fontSize: 16,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  cancelButton: {
    backgroundColor: '#2D3556',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B0B8D4',
  },
  buyButton: {
    backgroundColor: '#34D399',
  },
  sellButton: {
    backgroundColor: '#EF4444',
  },
});
