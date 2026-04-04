import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../../shared/theme/colors';

interface TradeButtonsProps {
  onBuy: () => void;
  onSell: () => void;
  disabled?: boolean;
}

export const TradeButtons: React.FC<TradeButtonsProps> = ({
  onBuy,
  onSell,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.buyButton, disabled && styles.disabled]}
        onPress={onBuy}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonIcon}>📈</Text>
        <Text style={styles.buyText}>Buy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.sellButton, disabled && styles.disabled]}
        onPress={onSell}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonIcon}>📉</Text>
        <Text style={styles.sellText}>Sell</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buyButton: {
    backgroundColor: colors.success,
  },
  sellButton: {
    backgroundColor: colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    fontSize: 18,
  },
  buyText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sellText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
