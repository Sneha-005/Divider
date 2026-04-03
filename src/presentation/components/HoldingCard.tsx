import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface HoldingCardProps {
  symbol: string;
  priceChange: number;
  units: number;
  averagePrice: number;
  currentPrice: number;
  value: number;
  changePercent: number;
  onPress?: () => void;
}

export const HoldingCard: React.FC<HoldingCardProps> = ({
  symbol,
  priceChange,
  units,
  averagePrice,
  currentPrice,
  value,
  changePercent,
  onPress,
}) => {
  const isNegative = priceChange < 0;
  const changeColor = isNegative ? '#EF4444' : '#34D399';

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={[styles.indicator, { backgroundColor: isNegative ? '#EF4444' : '#34D399' }]} />
          <View>
            <Text style={styles.symbol}>{symbol}</Text>
            <Text style={styles.units}>{units} units @ ₹{averagePrice.toFixed(2)} avg</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={[styles.priceChange, { color: changeColor }]}>
            {isNegative ? '₹' : '₹'}{Math.abs(priceChange).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.changePercent, { color: changeColor }]}>
            {isNegative ? '↓' : '↑'} {Math.abs(changePercent).toFixed(2)}%
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.detailText}>Current: ₹{currentPrice.toFixed(2)} | Value: ₹{value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  symbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  units: {
    fontSize: 12,
    color: '#64748B',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  priceChange: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  changePercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});
