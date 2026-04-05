import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
import { useExecuteTrade } from '../hooks/useTrading';

interface MarketData {
  symbol: string;
  currentPrice: number;
  volume: number;
  percentageChange: number;
}

interface TradingModalProps {
  visible: boolean;
  symbol: string;
  currentPrice: number;
  type: 'BUY' | 'SELL';
  marketData: MarketData[];
  onClose: () => void;
  onSuccess?: (result: any) => void;
}

export const TradingModal: React.FC<TradingModalProps> = ({
  visible,
  symbol: initialSymbol,
  currentPrice: initialPrice,
  type,
  marketData,
  onClose,
  onSuccess,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [quantity, setQuantity] = useState('');
  const [showStockPicker, setShowStockPicker] = useState(false);
  const { executeTrade, loading, error } = useExecuteTrade();
  const [tradeError, setTradeError] = useState<string | null>(null);

  // Get real-time price from market data
  const getCurrentPrice = (): number => {
    const stockData = marketData.find(m => m.symbol === selectedSymbol);
    return stockData?.currentPrice || initialPrice;
  };

  const currentPrice = getCurrentPrice();

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setQuantity('');
      setTradeError(null);
      setShowStockPicker(false);
      setSelectedSymbol(initialSymbol);
    }
  }, [visible, initialSymbol]);

  const total = parseFloat(quantity || '0') * currentPrice;
  const fee = total * 0.005; // 0.5% fee
  const totalWithFee = total + fee;

  const handleTrade = async () => {
    // Validate inputs
    const qty = parseFloat(quantity);
    const prc = currentPrice;

    if (!quantity || isNaN(qty) || qty <= 0) {
      setTradeError('Quantity must be a positive number');
      return;
    }

    if (!prc || prc <= 0) {
      setTradeError('Price must be a positive number');
      return;
    }

    setTradeError(null);

    const result = await executeTrade({
      symbol: selectedSymbol,
      quantity: qty,
      price: prc,
      type,
    });

    if (result.success) {
      // Extract details from successful response
      const dataObj = result.data || {};
      const total = dataObj.total || (qty * prc);
      const fee = dataObj.fee || (total * 0.005);
      const proceeds = total - fee;

      Alert.alert(
        '✅ Trade Executed',
        `${type} order for ${selectedSymbol}\n\n` +
        `Quantity: ${qty} shares\n` +
        `Price: ₹${prc.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n` +
        `Total: ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n` +
        `Fee: ₹${fee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n` +
        `${type === 'SELL' ? 'Proceeds' : 'Invested'}: ₹${proceeds.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess?.(result);
              onClose();
            },
          },
        ]
      );
    } else {
      // Parse error response structure
      const errorMessage = result.message || 'Trade failed';
      setTradeError(errorMessage);
      
      // Log error details for debugging
      console.error('❌ Trade Error:', {
        code: result.code,
        message: errorMessage,
        details: result.details,
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{type}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Stock Picker Dropdown */}
          {showStockPicker && (
            <View style={styles.pickerContainer}>
              <FlatList
                data={marketData}
                keyExtractor={(item) => item.symbol}
                scrollEnabled
                style={styles.stockList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.stockOption,
                      selectedSymbol === item.symbol && styles.selectedStock,
                    ]}
                    onPress={() => {
                      setSelectedSymbol(item.symbol);
                      setShowStockPicker(false);
                      setTradeError(null);
                    }}
                  >
                    <View>
                      <Text style={styles.stockOptionSymbol}>{item.symbol}</Text>
                      <Text style={styles.stockOptionPrice}>
                        ₹{item.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.stockOptionChange,
                        { color: item.percentageChange >= 0 ? '#34D399' : '#EF4444' },
                      ]}
                    >
                      {item.percentageChange >= 0 ? '+' : ''}{item.percentageChange.toFixed(2)}%
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <ScrollView style={styles.content}>
            {/* Stock Selector */}
            <View style={styles.stockSelectorSection}>
              <Text style={styles.label}>Select Stock</Text>
              <TouchableOpacity
                style={styles.stockSelectorButton}
                onPress={() => setShowStockPicker(!showStockPicker)}
              >
                <View style={styles.stockSelectorContent}>
                  <View>
                    <Text style={styles.selectedStockSymbol}>{selectedSymbol}</Text>
                    <Text style={styles.selectedStockPrice}>
                      ₹{currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                  <Text style={styles.dropdownArrow}>{showStockPicker ? '▲' : '▼'}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Real-time Price Display */}
            <View style={styles.priceSection}>
              <Text style={styles.label}>Current Market Price</Text>
              <Text style={styles.currentPrice}>
                ₹{currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </Text>
              <Text style={styles.priceNote}>🔄 Real-time from market data</Text>
            </View>

            {/* Quantity Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Quantity *</Text>
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

            {/* Calculation Summary */}
            {quantity && !isNaN(total) && (
              <View style={styles.summarySection}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal:</Text>
                  <Text style={styles.summaryValue}>
                    ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Fee (0.5%):</Text>
                  <Text style={styles.summaryValue}>
                    ₹{fee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>
                    ₹{totalWithFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            )}

            {/* Error Message */}
            {(tradeError || error) && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  ⚠️ {tradeError || error}
                </Text>
              </View>
            )}

            {/* Info Message */}
            {type === 'BUY' && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  💰 Ensure you have sufficient cash in your wallet
                </Text>
              </View>
            )}

            {type === 'SELL' && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  📊 Ensure you have enough shares to sell
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
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
                type === 'BUY' ? styles.buyButton : styles.sellButton,
                loading && styles.disabledButton,
              ]}
              onPress={handleTrade}
              disabled={loading || !quantity}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {type === 'BUY' ? 'Confirm Buy' : 'Confirm Sell'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1A1F3A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3556',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 24,
    color: '#B0B8D4',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pickerContainer: {
    maxHeight: 300,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#2D3556',
  },
  stockList: {
    maxHeight: 300,
  },
  stockOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2437',
  },
  selectedStock: {
    backgroundColor: '#1F2437',
    borderLeftWidth: 3,
    borderLeftColor: '#34D399',
  },
  stockOptionSymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stockOptionPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B0B8D4',
  },
  stockOptionChange: {
    fontSize: 12,
    fontWeight: '700',
  },
  stockSelectorSection: {
    marginBottom: 16,
  },
  stockSelectorButton: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#2D3556',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stockSelectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStockSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  selectedStockPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B0B8D4',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#34D399',
    fontWeight: '700',
  },
  priceNote: {
    fontSize: 11,
    color: '#7A8393',
    marginTop: 8,
    fontStyle: 'italic',
  },
  priceSection: {
    marginBottom: 20,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D3556',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B0B8D4',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  inputSection: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#2D3556',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledInput: {
    backgroundColor: '#0A0E27',
    borderColor: '#1F2437',
    color: '#7A8393',
  },
  summarySection: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D3556',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#2D3556',
    paddingTop: 12,
    marginTop: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#B0B8D4',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 14,
    color: '#34D399',
    fontWeight: '700',
  },
  errorContainer: {
    backgroundColor: '#7F1D1D',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#991B1B',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#064E3B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#047857',
  },
  infoText: {
    color: '#86EFAC',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButton: {
    backgroundColor: '#34D399',
  },
  sellButton: {
    backgroundColor: '#EF4444',
  },
  cancelButton: {
    backgroundColor: '#2D3556',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B0B8D4',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
