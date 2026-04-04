import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../shared/theme/colors';

interface StockListItemProps {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  change: number;
  onPress?: () => void;
}

export const StockListItem: React.FC<StockListItemProps> = ({
  symbol,
  name,
  price,
  changePercent,
  change,
  onPress,
}) => {
  const isPositive = changePercent >= 0;
  const changeColor = isPositive ? colors.success : colors.error;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <View>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.price}>₹{price.toFixed(2)}</Text>
        <View style={[styles.changeBox, { backgroundColor: isPositive ? colors.successLight : colors.errorLight }]}>
          <Text style={[styles.changeText, { color: changeColor }]}>
            {isPositive ? '↗' : '↘'} {Math.abs(changePercent).toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  symbol: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  name: {
    color: colors.textMuted,
    fontSize: 12,
  },
  price: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  changeBox: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
